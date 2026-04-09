# Plan: MerbaPDA Message List & Auth Demo

Build a PDA message feed on Home with animated pressable cards (Material on Android, Liquid Glass on iOS), a TrueSheet bottom sheet for details/response, and Azure AD auth on Profile. Uses zustand for state, mock data for demo.

---

## Phase 1: Foundation (types, store, mock data)

1. **Create `src/types/pda.ts`** — `PDAMessage` type based on the example JSON, adding `severity` (`'error' | 'warning' | 'info'`), `timestamp`, and `read` boolean
2. **Create `src/data/mockMessages.ts`** — 8-10 realistic Dutch industrial mock messages with varying severities
3. **Create `src/stores/messageStore.ts`** — Zustand store: messages array, selected message, `markAsRead(id)`, `setSelectedMessage(msg)`
4. **Create `src/stores/authStore.ts`** — Zustand store: user info, tokens, `isAuthenticated`, `login()`, `logout()`

## Phase 2: Components

5. **Create `src/components/MessageCard.tsx`** — Pressable card per message
   - Use Pressable `style` prop with `({pressed})` for press animation: `opacity: pressed ? 0.9 : 1`, `transform: [{ scale: pressed ? 0.985 : 1 }]`
   - Severity indicator: colored left border (red/amber/blue) + severity badge
   - Shows title, subtitle, severity, timestamp, unread dot
   - **Platform-adaptive**: `GlassView` (expo-glass-effect) on iOS, Material elevated card on Android

6. **Create `src/components/MessageSheet.tsx`** — TrueSheet bottom sheet
   - Full message details: title, description, say, group, location, systempartid
   - Two actions:
     - **"Acknowledge"** button that marks as read and closes the sheet
     - **"Respond"** option with a TextInput field so the operator can type a response message, plus a Send button
   - Platform-adaptive header styling

7. **Create `src/components/MessageListHeader.tsx`** — Title "PDA Messages" + severity filter chips (All / Error / Warning / Info)

## Phase 3: Screens

8. **Modify `src/app/(tabs)/home.tsx`** — FlatList of `MessageCard`s, filter state, pull-to-refresh, sheet ref management
9. **Modify `src/app/(tabs)/profile.tsx`** — Azure AD auth via `expo-auth-session`
   - Placeholder constants for `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` (clearly commented where to fill in)
   - `useAutoDiscovery` with Microsoft Entra ID endpoint: `https://login.microsoftonline.com/<TENANT_ID>/v2.0`
   - `useAuthRequest` with `{ clientId, scopes: ['openid', 'profile', 'email'], redirectUri }` 
   - No plugin needed — existing `"scheme": "merbapda"` in app.json handles the redirect
   - Login/logout buttons, user profile display when authenticated
   - State persisted in authStore
   - Change theme colors using the theme
   - Change the language (I have installed i18next and react-i18next)

## Phase 4: Polish

10. Severity → color mapping using existing theme `feedback` colors (`feedback.error`, `feedback.warning`, `feedback.info`)
11. Unread badge count on Home tab in `src/app/(tabs)/_layout.tsx` *(nice to have)*

---

## Relevant Files

| File | Action | What |
|------|--------|------|
| `src/types/pda.ts` | NEW | PDAMessage type |
| `src/data/mockMessages.ts` | NEW | Mock messages |
| `src/stores/messageStore.ts` | NEW | Zustand message store |
| `src/stores/authStore.ts` | NEW | Zustand auth store |
| `src/components/MessageCard.tsx` | NEW | Pressable card with `({pressed})` style animation |
| `src/components/MessageSheet.tsx` | NEW | TrueSheet bottom sheet (acknowledge + respond with TextInput) |
| `src/components/MessageListHeader.tsx` | NEW | Header + filter chips |
| `src/app/(tabs)/home.tsx` | MODIFY | Message list screen |
| `src/app/(tabs)/profile.tsx` | MODIFY | Azure auth screen |
| `src/constants/theme.tsx` | REFERENCE | Existing `feedback` colors, `useAppTheme()` |

## Verification

1. `npx expo start` → Home renders message cards
2. Press card → scale/opacity press effect + TrueSheet opens with full details
3. Filter by severity → list filters correctly
4. Sheet → "Acknowledge" marks read + closes; "Respond" shows TextInput + Send
5. Profile → Azure auth flow initiates (will fail without real credentials, but redirect URL is logged and flow starts)
6. Test both platforms: GlassView on iOS, Material cards on Android
7. Dark mode works with all new components

## Decisions

- **Severity** added to type even though not in original JSON — will come from backend in production
- **`expo-glass-effect`** already installed — used for iOS Liquid Glass cards
- **Press animation**: Pressable `style={({pressed}) => ...}` — no need for `Animated` API for this simple effect
- **Auth**: `expo-auth-session` does NOT need a plugin entry in app.json — the existing `"scheme": "merbapda"` is sufficient for redirect handling
- **Auth tokens in zustand** for demo; production should use `expo-secure-store`
- **Response flow**: Both "Acknowledge" (quick) and "Respond" with TextInput (detailed) options in the bottom sheet
- **Scope**: Home + Profile only. No message creation, no real backend, no push notifications
