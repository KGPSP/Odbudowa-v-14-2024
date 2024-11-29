-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enum types
create type user_role as enum (
  'user',
  'voivodeship_admin',
  'mswia_admin',
  'kprm_admin',
  'admin'
);

create type user_status as enum (
  'pending',
  'active',
  'inactive',
  'rejected'
);

create type claim_status as enum (
  'draft',
  'submitted',
  'voivodeship_review',
  'voivodeship_approved',
  'voivodeship_rejected',
  'returned',
  'mswia_review',
  'mswia_approved',
  'mswia_rejected',
  'kprm_review',
  'approved',
  'rejected'
);

create type verification_level as enum (
  'voivodeship',
  'mswia',
  'kprm',
  'completed'
);

create type bug_status as enum (
  'new',
  'in_progress',
  'resolved',
  'closed'
);

create type bug_priority as enum (
  'low',
  'medium',
  'high'
);

create type bug_category as enum (
  'error',
  'question',
  'suggestion'
);

create type news_status as enum (
  'draft',
  'published',
  'archived'
);

create type news_category as enum (
  'alert',
  'event',
  'update',
  'info'
);

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  encrypted_password text not null,
  first_name text not null,
  last_name text not null,
  position text not null,
  organizational_unit text not null,
  organization_type text not null,
  nip text,
  voivodeship text,
  county text,
  commune text,
  address text not null,
  phone text not null,
  role user_role not null default 'user',
  status user_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Claims table
create table public.claims (
  id uuid primary key default uuid_generate_v4(),
  object_name text not null,
  estimated_loss decimal not null,
  voivodeship text not null,
  county text not null,
  commune text not null,
  notes text,
  status claim_status not null default 'draft',
  current_level verification_level not null default 'voivodeship',
  created_by uuid references public.users(id) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  locked boolean not null default false
);

-- Claim history table
create table public.claim_history (
  id uuid primary key default uuid_generate_v4(),
  claim_id uuid references public.claims(id) not null,
  status claim_status not null,
  level verification_level not null,
  comment text,
  updated_by uuid references public.users(id) not null,
  updated_at timestamptz not null default now()
);

-- Claim files table
create table public.claim_files (
  id uuid primary key default uuid_generate_v4(),
  claim_id uuid references public.claims(id) not null,
  type text not null,
  name text not null,
  size integer not null,
  mime_type text not null,
  url text not null,
  uploaded_by uuid references public.users(id) not null,
  uploaded_at timestamptz not null default now()
);

-- Bug reports table
create table public.bug_reports (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category bug_category not null,
  priority bug_priority not null,
  status bug_status not null default 'new',
  created_by uuid references public.users(id) not null,
  assigned_to uuid references public.users(id),
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bug comments table
create table public.bug_comments (
  id uuid primary key default uuid_generate_v4(),
  bug_id uuid references public.bug_reports(id) not null,
  content text not null,
  author uuid references public.users(id) not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

-- News articles table
create table public.news_articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  excerpt text,
  slug text unique not null,
  category news_category not null,
  status news_status not null default 'draft',
  cover_image text,
  author uuid references public.users(id) not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- News tags table
create table public.news_tags (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

-- News articles tags junction table
create table public.news_articles_tags (
  article_id uuid references public.news_articles(id) not null,
  tag_id uuid references public.news_tags(id) not null,
  primary key (article_id, tag_id)
);

-- Indexes
create index idx_users_email on public.users(email);
create index idx_users_role on public.users(role);
create index idx_users_status on public.users(status);
create index idx_claims_status on public.claims(status);
create index idx_claims_current_level on public.claims(current_level);
create index idx_claims_created_by on public.claims(created_by);
create index idx_claim_history_claim_id on public.claim_history(claim_id);
create index idx_claim_files_claim_id on public.claim_files(claim_id);
create index idx_bug_reports_status on public.bug_reports(status);
create index idx_bug_reports_created_by on public.bug_reports(created_by);
create index idx_news_articles_status on public.news_articles(status);
create index idx_news_articles_slug on public.news_articles(slug);

-- Triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
  before update on public.users
  for each row
  execute function update_updated_at_column();

create trigger update_claims_updated_at
  before update on public.claims
  for each row
  execute function update_updated_at_column();

create trigger update_bug_reports_updated_at
  before update on public.bug_reports
  for each row
  execute function update_updated_at_column();

create trigger update_news_articles_updated_at
  before update on public.news_articles
  for each row
  execute function update_updated_at_column();

-- RLS Policies
alter table public.users enable row level security;
alter table public.claims enable row level security;
alter table public.claim_history enable row level security;
alter table public.claim_files enable row level security;
alter table public.bug_reports enable row level security;
alter table public.bug_comments enable row level security;
alter table public.news_articles enable row level security;
alter table public.news_tags enable row level security;
alter table public.news_articles_tags enable row level security;

-- Przykładowe polityki RLS (należy dostosować do wymagań)
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Admin can view all users"
  on public.users for select
  using (auth.jwt() ->> 'role' = 'admin');

-- Dodatkowe polityki należy dodać dla pozostałych tabel i operacji 