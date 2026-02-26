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
    themePreference: row.theme_preference || null,
    emailOptIn: row.email_opt_in ?? true,
  };
}

export async function getUserTeams(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_teams')
    .select('team_name')
    .eq('user_id', userId)
    .order('is_primary', { ascending: false })
    .order('joined_at', { ascending: true });

  if (error || !data) return [];
  return data.map((row) => row.team_name);
}

export async function addUserTeam(userId: string, teamName: string): Promise<void> {
  const trimmed = teamName.trim();
  await supabase.from('teams').upsert({ name: trimmed }, { onConflict: 'name' });

  const { error } = await supabase
    .from('user_teams')
    .upsert(
      { user_id: userId, team_name: trimmed },
      { onConflict: 'user_id,team_name' }
    );

  if (error) throw new Error(error.message);
}

export async function removeUserTeam(userId: string, teamName: string): Promise<void> {
  const { error } = await supabase
    .from('user_teams')
    .delete()
    .eq('user_id', userId)
    .eq('team_name', teamName);

  if (error) throw new Error(error.message);

  // If we removed the primary team, reassign primary to the first remaining team
  const remaining = await getUserTeams(userId);
  if (remaining.length > 0) {
    // Check if any team is still primary
    const { data: primaryRow } = await supabase
      .from('user_teams')
      .select('team_name')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .maybeSingle();

    if (!primaryRow) {
      await supabase
        .from('user_teams')
        .update({ is_primary: true })
        .eq('user_id', userId)
        .eq('team_name', remaining[0]);
    }

    // Sync users.team to match primary
    const primary = primaryRow?.team_name || remaining[0];
    await supabase.from('users').update({ team: primary }).eq('id', userId);
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (error || !data) return null;
  const user = userFromRow(data);
  user.teams = await getUserTeams(user.id);
  return user;
}

export async function findUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  const user = userFromRow(data);
  user.teams = await getUserTeams(user.id);
  return user;
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
  const user = userFromRow(data);

  // Also add to user_teams junction table
  await supabase
    .from('user_teams')
    .upsert(
      { user_id: user.id, team_name: team.trim(), is_primary: true },
      { onConflict: 'user_id,team_name' }
    );
  user.teams = [team.trim()];

  return user;
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
  const user = userFromRow(data);

  // Ensure user_teams entry exists
  await supabase
    .from('user_teams')
    .upsert(
      { user_id: user.id, team_name: team.trim(), is_primary: true },
      { onConflict: 'user_id,team_name' }
    );
  user.teams = await getUserTeams(user.id);

  return user;
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
  themePreference: string | null
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

export async function updateEmailOptIn(
  userId: string,
  optIn: boolean
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ email_opt_in: optIn })
    .eq('id', userId);

  if (error) throw new Error(error.message);
}
