'use server';

import { getMongoClient } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Promotion = {
  _id?: string;
  title: string;
  price: number;
  createdAt: Date;
  imageUrl?: string;
  dayKey?: string; // YYYY-MM-DD (America/Argentina/Buenos_Aires)
};

// Internal type for MongoDB documents
type DBPromotion = {
  _id?: ObjectId;
  title: string;
  price: number;
  createdAt?: Date;
  imageUrl?: string;
  dayKey?: string;
};

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const client = await getMongoClient();
    const db = client.db();
    const promotions = await db
      .collection<DBPromotion>('promotions')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // Normalize _id to string for serialization
    return promotions.map((p: DBPromotion) => ({
      _id: p._id?.toString(),
      title: p.title,
      price: Number(p.price),
      createdAt: p.createdAt ?? new Date(),
      imageUrl: p.imageUrl ?? undefined,
    }));
  } catch (err) {
    console.error('getPromotions error:', err);
    return [];
  }

}

// Convenience alias for admin panel to explicitly fetch ALL promotions (no date filter)
export async function getAllPromotions(): Promise<Promotion[]> {
  return await getPromotions();
}

function getBuenosAiresDayKey(date = new Date()): string {
  // Get date parts in Buenos Aires TZ and format as YYYY-MM-DD
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(date); // en-CA yields YYYY-MM-DD
}

export async function getPromotionsToday(): Promise<Promotion[]> {
  try {
    const client = await getMongoClient();
    const db = client.db();
    const todayKey = getBuenosAiresDayKey();
    const promotions = await db
      .collection<DBPromotion>('promotions')
      .find({ dayKey: todayKey })
      .sort({ createdAt: -1 })
      .toArray();

    return promotions.map((p: DBPromotion) => ({
      _id: p._id?.toString(),
      title: p.title,
      price: Number(p.price),
      createdAt: p.createdAt ?? new Date(),
      imageUrl: p.imageUrl ?? undefined,
      dayKey: p.dayKey,
    }));
  } catch (err) {
    console.error('getPromotionsToday error:', err);
    return [];
  }
}
export async function addPromotion(formData: FormData) {
  try {
    console.log('addPromotion called');
    const cookieStore = await cookies();
    console.log('cookieStore', cookieStore);

    const session = cookieStore.get('admin_session');
    console.log('session', session);
    if (!session) {
      return { success: false, error: 'No autorizado' } as const;
    }

    const title = String(formData.get('title') ?? '').trim();
    const priceRaw = String(formData.get('price') ?? '').trim();
    const price = Number(priceRaw);
    const imageUrlRaw = String(formData.get('imageUrl') ?? '').trim();

    const imageUrl = imageUrlRaw ? imageUrlRaw : undefined;

    if (!title || !Number.isFinite(price) || price < 0) {
      throw new Error('Datos inválidos');
    }

    console.log('session value', session.value);
    const client = await getMongoClient();
    console.log('client', client);
    const db = client.db();
    console.log('db', db);

    console.log('Adding promotion:', { title, price });

    const dayKey = getBuenosAiresDayKey();

    await db.collection('promotions').insertOne({
      title,
      price,
      createdAt: new Date(),
      imageUrl,
      dayKey,
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true } as const;
  } catch (err) {
    console.error('addPromotion error:', err);
    return { success: false, error: 'No se pudo agregar la promoción' } as const;
  }
}

export async function deletePromotion(id: string) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session) {
      return { success: false, error: 'No autorizado' } as const;
    }

    if (!id) throw new Error('ID requerido');

    const client = await getMongoClient();
    const db = client.db();

    await db.collection('promotions').deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true } as const;
  } catch (err) {
    console.error('deletePromotion error:', err);
    return { success: false, error: 'No se pudo eliminar la promoción' } as const;
  }
}

// ----- Auth actions -----
export async function login(formData: FormData): Promise<void> {
  const user = String(formData.get('username') ?? '');
  const pass = String(formData.get('password') ?? '');

  const expectedUser = process.env.ADMIN_USER || '';
  const expectedPass = process.env.ADMIN_PASS || '';

  console.log('user', user);
  console.log('pass', pass);
  console.log('typeofpassword', typeof pass);

  // Compare against env variables, with development fallbacks
  const ok = user === (expectedUser || 'alan') && pass === (expectedPass || '1234');
  if (!ok) {
    // Redirect back to login with an error flag; do not return a value
    redirect('/login?error=1');
  }

  // Set a simple session cookie
  const cookieStore = await cookies();
  cookieStore.set('admin_session', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });

  console.log('redirecting to /admin');
  
  redirect('/admin');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/login');
}