// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for car rental system

// Get all available cars
export async function getCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*');
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Check car availability for given dates
export async function checkCarAvailability(carId, startDate, endDate) {
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('start_date, end_date, status')
    .eq('car_id', carId)
    .neq('status', 'annulé'); // Ignore canceled reservations

  if (error) throw error;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check for overlapping reservations
  const isAvailable = !reservations.some((reservation) => {
    const resStart = new Date(reservation.start_date);
    const resEnd = new Date(reservation.end_date);
    return start <= resEnd && end >= resStart;
  });

  return { isAvailable };
}
  

export async function createReservation(reservationData) {
  const { data, error } = await supabase.from('reservations').insert([reservationData]).select();
  if (error) throw error;
  return data[0];
}

// Get reservations for a specific car
export async function getCarReservations(carId) {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('car_id', carId);
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Get reservation by ID
export async function getReservation(id) {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
}
/**
 * Fetch all accessories from the database
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of records to return
 * @param {number} options.offset - Number of records to skip
 * @returns {Promise<Array>} - Array of product objects
 */
export async function fetchAccessories({ limit = 12, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching accessories:', error);
    throw new Error('Failed to fetch accessories');
  }

  return data || [];
}

/**
 * Search accessories by name or description
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of product objects
 */
export async function searchAccessories(query) {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching accessories:', error);
    throw new Error('Failed to search accessories');
  }

  return data || [];
}

/**
 * Fetch accessories by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} - Array of product objects
 */
export async function fetchAccessoriesByCategory(category) {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching accessories in category ${category}:`, error);
    throw new Error('Failed to fetch accessories by category');
  }

  return data || [];
}