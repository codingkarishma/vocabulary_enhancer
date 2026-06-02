-- LexUp Database Schema for Supabase

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  level VARCHAR(50) DEFAULT 'Beginner',
  streak INTEGER DEFAULT 0,
  currentChapter INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Words Table
CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  chapterId INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  word VARCHAR(255) NOT NULL,
  meaning TEXT NOT NULL,
  example TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Words Table (tracks learned words)
CREATE TABLE IF NOT EXISTS user_words (
  id SERIAL PRIMARY KEY,
  userId UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wordId INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  learned BOOLEAN DEFAULT FALSE,
  learned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, wordId)
);

-- Quiz Results Table
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  userId UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapterId INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Anyone can read chapters and words
CREATE POLICY "Chapters are readable by all" ON chapters FOR SELECT USING (true);
CREATE POLICY "Words are readable by all" ON words FOR SELECT USING (true);

-- Users can only see their own learned words
CREATE POLICY "Users can view their own learned words" ON user_words FOR SELECT USING (auth.uid() = userId);
CREATE POLICY "Users can insert their own learned words" ON user_words FOR INSERT WITH CHECK (auth.uid() = userId);

-- Users can only see their own quiz results
CREATE POLICY "Users can view their own quiz results" ON quiz_results FOR SELECT USING (auth.uid() = userId);
CREATE POLICY "Users can insert their own quiz results" ON quiz_results FOR INSERT WITH CHECK (auth.uid() = userId);

-- Insert Sample Chapters
INSERT INTO chapters (title, description, order_number) VALUES
  ('Everyday Vocabulary', 'Common words for daily conversations', 1),
  ('Communication Vocabulary', 'Words to improve your communication skills', 2),
  ('Professional Vocabulary', 'Business and professional terms', 3),
  ('Interview Vocabulary', 'Words commonly used in job interviews', 4),
  ('Advanced Vocabulary', 'Complex and sophisticated words', 5)
ON CONFLICT DO NOTHING;

-- Insert Sample Words for Chapter 1
INSERT INTO words (chapterId, word, meaning, example) VALUES
  (1, 'Serendipity', 'The occurrence of events by chance in a happy or beneficial way', 'Meeting her at the coffee shop was pure serendipity.'),
  (1, 'Eloquent', 'Fluent, persuasive, and expressive in speaking or writing', 'His eloquent speech moved the entire audience.'),
  (1, 'Ephemeral', 'Lasting for a very short time', 'The beauty of cherry blossoms is ephemeral.'),
  (1, 'Vivacious', 'Lively, animated, and full of energy', 'Her vivacious personality brightened the room.'),
  (1, 'Placid', 'Calm and peaceful', 'The placid lake reflected the mountains perfectly.'),
  (1, 'Benevolent', 'Kind and generous', 'The benevolent donation helped many families.'),
  (1, 'Candid', 'Honest and frank', 'Her candid feedback was very helpful.'),
  (1, 'Diligent', 'Hardworking and careful', 'His diligent efforts led to success.'),
  (1, 'Melancholy', 'Sad and pensive', 'The melancholy melody moved everyone.'),
  (1, 'Fortuitous', 'Accidental and lucky', 'The meeting was a fortuitous discovery.'),
  (1, 'Gregarious', 'Sociable and enjoying company', 'She is a gregarious person who loves parties.'),
  (1, 'Astute', 'Clever and perceptive', 'His astute observation solved the problem.'),
  (1, 'Prudent', 'Wise and careful', 'It was a prudent decision to save money.'),
  (1, 'Ubiquitous', 'Present everywhere', 'Smartphones are ubiquitous in modern society.'),
  (1, 'Ineluctable', 'Impossible to avoid', 'Death is ineluctable for all living things.'),
  (1, 'Perspicacious', 'Having keen insight', 'Her perspicacious analysis impressed everyone.'),
  (1, 'Sanguine', 'Optimistic and positive', 'Despite setbacks, he remained sanguine about the future.'),
  (1, 'Tacit', 'Understood without being stated', 'There was a tacit agreement between them.'),
  (1, 'Vapid', 'Lacking liveliness or interest', 'The conversation was vapid and boring.'),
  (1, 'Zenith', 'The highest point', 'His career reached its zenith after decades of work.')
ON CONFLICT DO NOTHING;

-- Insert Sample Words for Chapter 2
INSERT INTO words (chapterId, word, meaning, example) VALUES
  (2, 'Articulate', 'Express clearly and effectively', 'She articulated her ideas with clarity.'),
  (2, 'Verbose', 'Using more words than necessary', 'His verbose writing style could be more concise.'),
  (2, 'Concise', 'Brief and clear', 'The concise explanation was easy to understand.'),
  (2, 'Dialogue', 'Conversation between two or more people', 'The dialogue in the movie was witty and engaging.'),
  (2, 'Discourse', 'Written or spoken communication', 'Academic discourse requires precision.'),
  (2, 'Rhetoric', 'Art of effective speaking or writing', 'His powerful rhetoric swayed the audience.'),
  (2, 'Eloquence', 'Fluent and persuasive speaking', 'Her eloquence captivated the room.'),
  (2, 'Monologue', 'Long speech by one person', 'The actor delivered a powerful monologue.'),
  (2, 'Repartee', 'Quick, witty conversation', 'Their repartee was amusing and clever.'),
  (2, 'Garrulous', 'Talkative; tending to talk too much', 'The garrulous old man never stopped talking.'),
  (2, 'Taciturn', 'Not talkative; reserved', 'He is a taciturn person who rarely speaks.'),
  (2, 'Loquacious', 'Fond of talking; talkative', 'The loquacious speaker kept the audience entertained.'),
  (2, 'Succinct', 'Briefly and clearly expressed', 'Her succinct response answered all questions.'),
  (2, 'Plaintive', 'Sounding sad or yearning', 'The plaintive cry echoed through the night.'),
  (2, 'Resonate', 'Sound deeply or harmoniously', 'Her words resonated with the audience.'),
  (2, 'Nuance', 'A subtle difference in meaning or tone', 'The nuance of the poem was lost in translation.'),
  (2, 'Candor', 'The quality of being honest and frank', 'She spoke with candor about her feelings.'),
  (2, 'Enigmatic', 'Mysterious or puzzling', 'His enigmatic smile left everyone wondering.'),
  (2, 'Ambiguous', 'Open to more than one interpretation', 'The ambiguous statement caused confusion.'),
  (2, 'Lucid', 'Clear and easy to understand', 'The professor gave a lucid explanation.')
ON CONFLICT DO NOTHING;

-- Insert Sample Words for Chapter 3
INSERT INTO words (chapterId, word, meaning, example) VALUES
  (3, 'Expertise', 'Expert skill or knowledge in a particular field', 'His expertise in finance was invaluable.'),
  (3, 'Competence', 'The ability to do something successfully', 'She demonstrated great competence in her role.'),
  (3, 'Proficiency', 'A high degree of skill or competence', 'His proficiency in languages impressed everyone.'),
  (3, 'Acumen', 'Keen insight and good judgment', 'Her business acumen led to company growth.'),
  (3, 'Pragmatic', 'Dealing with things in a practical way', 'We took a pragmatic approach to the problem.'),
  (3, 'Meticulous', 'Showing attention to detail', 'His meticulous work was error-free.'),
  (3, 'Diligent', 'Showing care in one''s work', 'The diligent team completed the project early.'),
  (3, 'Proactive', 'Taking action in anticipation', 'A proactive approach prevents problems.'),
  (3, 'Synergy', 'The interaction of elements working together', 'Great synergy exists between the teams.'),
  (3, 'Leverage', 'Use something to maximum advantage', 'We leveraged our resources effectively.'),
  (3, 'Optimize', 'Make as good or effective as possible', 'We optimized our workflow for efficiency.'),
  (3, 'Strategize', 'Plan or devise a strategy', 'Let''s strategize before the meeting.'),
  (3, 'Implement', 'Put a plan into effect', 'We implemented the new policy successfully.'),
  (3, 'Scalable', 'Able to be changed in size or scale', 'Our scalable solution grows with demand.'),
  (3, 'Robust', 'Strong and healthy; not delicate', 'The robust framework handles various scenarios.'),
  (3, 'Resilient', 'Able to recover quickly', 'Our resilient team handled the crisis well.'),
  (3, 'Innovative', 'Featuring new methods or ideas', 'Their innovative approach changed the industry.'),
  (3, 'Paramount', 'Of utmost importance', 'Quality is paramount in our business.'),
  (3, 'Negligible', 'So small as to be insignificant', 'The impact was negligible.'),
  (3, 'Rigorous', 'Extremely thorough and careful', 'The rigorous testing ensured quality.')
ON CONFLICT DO NOTHING;

-- Insert Sample Words for Chapters 4 and 5 (abbreviated for space)
INSERT INTO words (chapterId, word, meaning, example) VALUES
  (4, 'Qualifications', 'Official record of one''s achievements', 'Her qualifications impressed the hiring committee.'),
  (4, 'Motivation', 'Reason for action or belief', 'Her motivation for the job was clear.'),
  (4, 'Leadership', 'The ability to guide and influence others', 'His leadership skills were evident during the project.'),
  (4, 'Communication', 'The imparting of information', 'Good communication is essential in this role.'),
  (4, 'Adaptability', 'The quality of being able to adjust', 'Adaptability is crucial in this fast-changing field.'),
  (5, 'Obfuscate', 'To deliberately make unclear', 'His response was meant to obfuscate the truth.'),
  (5, 'Erudite', 'Scholarly and intellectually deep', 'His erudite lecture impressed the academics.'),
  (5, 'Pernicious', 'Harmful in a subtle or gradual way', 'The pernicious effects of the disease took years.'),
  (5, 'Sycophant', 'A person who acts obsequiously', 'The sycophant constantly praised the boss.'),
  (5, 'Ephemeral', 'Lasting for a very short time', 'Success in showbiz can be ephemeral.')
ON CONFLICT DO NOTHING;
