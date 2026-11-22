# DECISIONS.md

Each entry: the choice, the option I rejected, and why.

## 1. User vs member
- Choice: User
- Rejected: member
- Why:User dosent meant that he is a member, that means he has paid the fees. So we need to segegrate them also, membership can expire so we dont delete the user we keep it. 

## 2. Ids (uuid vs bigint identity)
- Choice: uuid
- Rejected: bigint
- Why: we want the uuid to be generated automaticlly. 

## 3. Money (numeric rupees vs integer paise)
- Choice:numeric rupees
- Rejected: integer paise
- Why: we work in whole nmbers

## 4. Status vs dates (which wins at check-in, who moves to expired)
- Choice:dates
- Rejected: Status
- Why:We will keep a check of the dates and our logic will be that if the date has passsed the current date we change the status of membership

## 5. One active membership per member
- Choice: One active membership
- Rejected:
- Why:We cant have multiple mumbersher per memeber

## 6. Deleting a member (CASCADE / RESTRICT / soft delete)
- Choice:RESTRICT
- Rejected:soft delete
- Why:we want to keep the meber is our database as a user we dont want to delete it. 

## 7. Reminder idempotency (column vs membership_reminders table)
- Choice:membership_reminders 
- Rejected: column
- Why:we can keep a tab if the reminder has been sent

## 8. Overbooking (SELECT ... FOR UPDATE vs conditional UPDATE)
- Choice: pick the best for our plan
- Rejected:
- Why:
