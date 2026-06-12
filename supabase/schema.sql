-- Waitlist applicants & approved members
CREATE TABLE IF NOT EXISTS profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  age integer,
  gender text CHECK (gender IN ('male', 'female')),
  occupation text,
  city text,
  goals text,
  linkedin text,
  instagram text,
  status text DEFAULT 'waitlist' CHECK (status IN ('waitlist', 'approved', 'rejected')),
  is_paid boolean DEFAULT false,
  auth_user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Bot & real discovery profiles (what members browse)
CREATE TABLE IF NOT EXISTS discover_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  age integer,
  gender text CHECK (gender IN ('male', 'female')),
  occupation text,
  company text,
  city text,
  education text,
  bio text,
  instagram text,
  linkedin text,
  avatar_initial text,
  is_bot boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Likes (member → discover profile)
CREATE TABLE IF NOT EXISTS likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_email text NOT NULL,
  to_discover_id uuid REFERENCES discover_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_email, to_discover_id)
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discover_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a profile (waitlist signup)
CREATE POLICY "Anyone can apply" ON profiles FOR INSERT WITH CHECK (true);

-- Only owner can read their own profile
CREATE POLICY "Read own profile" ON profiles FOR SELECT USING (auth.uid() = auth_user_id);

-- Approved members can read all active discover profiles
CREATE POLICY "Members read discover" ON discover_profiles FOR SELECT USING (is_active = true);

-- Members can insert/read their own likes
CREATE POLICY "Members can like" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Members read likes" ON likes FOR SELECT USING (true);

-- Seed bot profiles
INSERT INTO discover_profiles (name, age, gender, occupation, company, city, education, bio, instagram, linkedin, avatar_initial) VALUES
-- Men
('Aryo S.', 29, 'male', 'Senior Associate', 'McKinsey Jakarta', 'South Jakarta', 'NUS, Singapore', 'Family-oriented, intellectually curious, and genuinely looking for his person.', '@aryo.s', 'linkedin.com/in/aryo-s', 'A'),
('Bimo R.', 31, 'male', 'Investment Banker', 'Goldman Sachs', 'Central Jakarta', 'UI, Salemba', 'Competitive tennis player, weekend cook, and firm believer in deep conversations over small talk.', '@bimo.r', 'linkedin.com/in/bimo-r', 'B'),
('Daffa H.', 28, 'male', 'Co-Founder', 'Series A Startup', 'South Jakarta', 'ITB Bandung', 'Building something meaningful by day, terrible chef on weekends. Looking for a real partner.', '@daffa.h', 'linkedin.com/in/daffa-h', 'D'),
('Evan P.', 32, 'male', 'Associate', 'BCG Jakarta', 'Kebayoran Baru', 'Erasmus University', 'Loves hiking in Lombok, reads too much non-fiction, and takes long-term seriously.', '@evan.p', 'linkedin.com/in/evan-p', 'E'),
('Farhan K.', 30, 'male', 'Senior Associate', 'Makarim & Taira S.', 'SCBD Jakarta', 'Leiden University', 'Corporate lawyer who values quality time and meaningful connections over everything.', '@farhan.k', 'linkedin.com/in/farhan-k', 'F'),
('Gilang M.', 27, 'male', 'Software Engineer', 'Google Jakarta', 'BSD, Tangerang', 'Universitas Indonesia', 'Hiker, reader, amateur photographer. Looking for someone who matches ambition with warmth.', '@gilang.m', 'linkedin.com/in/gilang-m', 'G'),
('Hendra W.', 33, 'male', 'Finance Director', 'Unilever Indonesia', 'Menteng, Jakarta', 'Melbourne University', 'Introvert who runs marathons. Serious about finding the right person, not just the next date.', '@hendra.w', 'linkedin.com/in/hendra-w', 'H'),
('Ibrahim A.', 29, 'male', 'Consultant', 'Bain & Company', 'Pondok Indah', 'King''s College London', 'Grew up between Jakarta and Singapore. Curious, driven, and ready for something real.', '@ibrahim.a', 'linkedin.com/in/ibrahim-a', 'I'),
-- Women
('Rania K.', 27, 'female', 'Strategy Consultant', 'McKinsey Jakarta', 'South Jakarta', 'LSE, London', 'Loves deep conversations, hikes on weekends, and knows exactly what she wants.', '@rania.k', 'linkedin.com/in/rania-k', 'R'),
('Sashi D.', 28, 'female', 'Investment Banker', 'Citi Jakarta', 'Sudirman, Jakarta', 'NTU Singapore', 'Finance by day, yoga at dawn. Looking for someone who matches her energy and values.', '@sashi.d', 'linkedin.com/in/sashi-d', 'S'),
('Thalia R.', 26, 'female', 'Associate', 'SSEK Law Firm', 'SCBD Jakarta', 'Vrije Universiteit', 'Corporate lawyer who still makes time for art and travel. Serious about the right things.', '@thalia.r', 'linkedin.com/in/thalia-r', 'T'),
('Ulia M.', 30, 'female', 'Founder', 'D2C Fashion Brand', 'Kemang, Jakarta', 'Universitas Indonesia', 'Built a business from scratch. Now ready to build a life with the right person.', '@ulia.m', 'linkedin.com/in/ulia-m', 'U'),
('Vanya S.', 29, 'female', 'Finance Manager', 'HSBC Indonesia', 'Senopati, Jakarta', 'Monash University', 'CFA candidate, avid reader, weekend baker. Looking for depth, not just compatibility on paper.', '@vanya.s', 'linkedin.com/in/vanya-s', 'V'),
('Wulan P.', 28, 'female', 'Product Manager', 'Gojek', 'East Jakarta', 'Bandung Institute of Technology', 'Solves problems for 10M users at work. Outside of work, just looking for her person.', '@wulan.p', 'linkedin.com/in/wulan-p', 'W'),
('Xandra K.', 31, 'female', 'Marketing Director', 'L''Oréal Indonesia', 'Menteng, Jakarta', 'ESSEC Business School', 'International background, local roots. Wants a partner who is as driven as they are kind.', '@xandra.k', 'linkedin.com/in/xandra-k', 'X'),
('Yasmin A.', 27, 'female', 'Consultant', 'Deloitte Jakarta', 'Kemang, Jakarta', 'Durham University', 'Half-Indonesian, half-Australian. Fluent in three languages and looking for the real thing.', '@yasmin.a', 'linkedin.com/in/yasmin-a', 'Y');
