insert into books (id, title, title_sanskrit, attribution, description)
values (
  'gita-001',
  'Bhagavad Gita',
  'श्रीमद्भगवद्गीता',
  'Traditionally attributed to Maharshi Vedavyasa',
  'A dialogue between Bhagavan Sri Krishna and Arjuna.'
)
on conflict (id) do nothing;

insert into chapters (id, book_id, chapter_number)
select
  'gita-001-chapter-' || n,
  'gita-001',
  n
from generate_series(1, 18) as n
on conflict (id) do nothing;
