# DECISIONS.md

Each entry: the choice, the option I rejected, and why.

## 1. User vs member

- Choice: `members` is the main table (the person). Memberships are a separate `memberships` table linked to it, one row per purchase, with its own start and end date.
- Rejected: putting the membership dates on the member row, and treating "member" as only someone who currently has paid.
- Why: A person exists before they pay and after their plan expires, so "member" is a state, not a kind of person. When a membership expires we keep the member and their history. A renewal adds a new membership row instead of overwriting old dates. "Is this person a member today?" is answered by checking whether a membership's dates cover today. Staff are not members and log in through their own accounts.

## 2. Ids (uuid vs bigint identity)

- Choice: uuidv7
- Rejected: bigint identity (and random uuidv4)
- Why: Ids show up in URLs, and sequential bigints let anyone guess neighbouring ids and estimate how many members we have. uuidv7 is not guessable. It is also time-ordered, so new rows land at the end of the index, which keeps inserts fast, unlike random uuidv4. Costs we accept: 16 bytes instead of 8, and the id reveals roughly when the row was created. Unguessable ids do not replace permission checks on every request.

## 3. Money (numeric rupees vs integer paise)

- Choice: numeric rupees, `numeric(10,2)`
- Rejected: integer paise
- Why: Gym fees are whole rupees today, and `numeric` stores them exactly (no float rounding errors) and reads naturally as 1500.00. Integer paise would force x100 and /100 conversions at every edge for no benefit right now. The `pg` driver returns `numeric` as a string, so we convert at the boundary and never add them as floats. Revisit if GST, discounts or pro-rated fees start producing awkward fractions.

## 4. Status vs dates (which wins at check-in, who moves to expired)

- Choice: dates win
- Rejected: trusting the status column
- Why: At check-in we compare the membership's end date with today (in IST, using a `DATE` column), so an expired member is blocked immediately even if no job has run yet. The status is a cached label that a scheduled job updates, moving memberships past their end date to `expired`, so lists and reports stay tidy. If the job is late or fails, the label can be wrong, but access control is still correct.

## 5. One active membership per member

- Choice: one active membership per member, enforced by the database with a partial unique index on `member_id` where `status = 'active'`
- Rejected: allowing several active memberships at once (stacked or overlapping)
- Why: Check-in and reports then have a single answer to "what is their current membership?". An app-level check alone can race: two staff pressing Renew at the same moment could both pass it. A renewal before expiry creates the next membership starting after the current end date, not a second active one. Because status can be stale (see #4), a renewal runs in one transaction: mark the old row `expired` if its end date has passed, then insert the new one.

## 6. Deleting a member (CASCADE / RESTRICT / soft delete)

- Choice: soft delete (a `deleted_at` column)
- Rejected: CASCADE and RESTRICT
- Why: Payment and attendance history must never disappear. CASCADE would silently erase it when a member is removed. RESTRICT would block deletion but give staff no way to remove someone from view. With soft delete the member disappears from lists and their history stays intact. Costs we accept: every query must filter `deleted_at IS NULL`, and unique fields such as phone or email need a partial unique index that ignores deleted rows.

## 7. Reminder idempotency (column vs membership_reminders table)

- Choice: `membership_reminders` table
- Rejected: a `reminder_sent_at` column on memberships
- Why: A membership gets several reminders (for example 7 days before, 1 day before, and expired), and one column can hold only one. The table has a row per (membership, reminder type) with a unique constraint, and the job inserts with `ON CONFLICT DO NOTHING` and sends only if a row was actually inserted. If the job runs twice (retry, restart, two workers), the reminder is sent once. It also records when each reminder went out.

## 8. Overbooking (SELECT ... FOR UPDATE vs conditional UPDATE)

- Choice: conditional UPDATE, e.g. `UPDATE class_sessions SET booked = booked + 1 WHERE id = $1 AND booked < capacity`, in the same transaction as the booking insert
- Rejected: `SELECT ... FOR UPDATE`
- Why: It is one atomic statement, so the database handles simultaneous requests one at a time. If it updates 0 rows, the class is full. The lock lives only for that statement, whereas `FOR UPDATE` holds a lock across several round trips from Node while our code runs. The cost is a `booked` counter that must stay in sync: increment on booking and decrement on cancellation, in the same transaction as the booking insert or delete. A unique constraint on (class, member) stops the same person booking twice. Revisit `FOR UPDATE` if the rules get richer, such as waitlists or tiered capacity.
