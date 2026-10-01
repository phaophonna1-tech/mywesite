# Security Specification & Threat Model

## Data Invariants
1. Customer identity: Every booking document must link to the authenticated `userId`. Customers can only read and manage their own bookings (`resource.data.userId == request.auth.uid`).
2. Admin permissions: Administrators (`isAdmin()`) can view all bookings, modify booking statuses (`pending` -> `approved` -> `paid` -> `cancelled`), add administrative notes, and manage destinations.
3. Bootstrapped Administrator: Email `phaophonna.1@gmail.com` is recognized as the super administrator across auth tokens and Firestore rules.
4. PII Protection: Users can only read their own user profiles. General public cannot read customer profile data or booking details.
5. Destinations: Read access is open to all visitors so itineraries display. Create, update, and delete access is restricted to verified administrators.

## The Dirty Dozen Payloads (Designed to Fail)
1. **Unauthenticated Booking Create**: Anonymous or missing auth creating a booking. -> `DENIED`
2. **Identity Spoofing Booking**: Authenticated user `A` submitting booking with `userId: 'user_B'`. -> `DENIED`
3. **Customer Self-Approve**: Customer updating booking status from `pending` to `paid` or `approved`. -> `DENIED`
4. **Unauthorized Read**: Customer `A` querying or listing bookings belonging to Customer `B`. -> `DENIED`
5. **Unauthorized Destination Create**: Regular customer attempting to inject or create a destination. -> `DENIED`
6. **Price Tampering**: Regular customer editing destination `priceFrom` or `heroImage`. -> `DENIED`
7. **Profile Privilege Escalation**: Regular user updating their own profile document with `role: 'admin'`. -> `DENIED`
8. **Admin Collection Injection**: Regular user writing a document into `/admins/{userId}`. -> `DENIED`
9. **Junk Key Injection (Shadow Update)**: Submitting unknown ghost keys on a booking update. -> `DENIED`
10. **ID Poisoning Attack**: Passing an oversized 2KB document ID with invalid characters. -> `DENIED`
11. **Total Price Negative**: Creating booking with negative or NaN estimatedTotal. -> `DENIED`
12. **Malicious Image XSS Injection**: Passing non-string or 10KB script in `heroImage` field. -> `DENIED`
