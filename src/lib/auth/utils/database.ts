import { supabase } from '../../supabase';
import { User, UserRow } from '../types/auth';

function userFromRow(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    team: row.team,
    isStub: row.is_stub,
    isAdmin: row.is_admin ?? false,
    createdAt: new Date(row.created_at),
    themePreference: (row.theme_preference as 'cult' | 'corporate') || null,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (error || !data) return null;
  return userFromRow(data);
}

export async function findUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return userFromRow(data);
}

export async function createUser(
  name: string,
  email: string,
  team: string
): Promise<User> {
  // Ensure the team exists
  await supabase.from('teams').upsert({ name: team }, { onConflict: 'name' });

  const { data, error } = await supabase
    .from('users')
    .insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      team: team.trim(),
      is_stub: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return userFromRow(data);
}

export async function createStubUser(
  email: string,
  team: string
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: email.split('@')[0],
      email: email.toLowerCase().trim(),
      team: team.trim(),
      is_stub: true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return userFromRow(data);
}

export async function convertStubUser(
  email: string,
  name: string,
  team: string
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update({
      name: name.trim(),
      team: team.trim(),
      is_stub: false,
    })
    .eq('email', email.toLowerCase().trim())
    .eq('is_stub', true)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return userFromRow(data);
}

export async function listTeams(): Promise<string[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('name')
    .order('name');

  if (error || !data) return [];
  return data.map((t) => t.name);
}

export async function createTeam(name: string): Promise<void> {
  await supabase.from('teams').upsert({ name: name.trim() }, { onConflict: 'name' });
}

export async function updateUserTeam(
  userId: string,
  team: string
): Promise<User> {
  // Ensure the team exists
  await supabase.from('teams').upsert({ name: team.trim() }, { onConflict: 'name' });

  const { data, error } = await supabase
    .from('users')
    .update({ team: team.trim() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return userFromRow(data);
}

export async function updateUserTheme(
  userId: string,
  themePreference: 'cult' | 'corporate' | null
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update({ theme_preference: themePreference })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return userFromRow(data);
}
