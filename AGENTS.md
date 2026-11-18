# Project Guidance

## User Preferences

- Idioma de la interfaz: español
- Fondo color celeste con letras blancas
- Estilo cálido y profesional
- Logotipo del partido Vente Venezuela a un lado de la cabecera
- Imagen de María Corina montada en un tractor en una siembra de maíz
- Aviso de registro exitoso en color verde

## Accepted Requirements

- Recordatorio programado para el 27 de noviembre de 2026 a las 12:00 del mediodía con el aviso «Venezuela, Guárico y Calabozo cuentan contigo» y la invitación a la asamblea en el lugar y la hora pautados
- Envío del recordatorio a todos los números de teléfono registrados en el evento
- Panel de administración protegido por inicio de sesión para revisar y enviar el recordatorio

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Frontend commands (from src/frontend/): `pnpm typecheck`, `pnpm fix`, `pnpm build`; backend (from src/backend/): `mops install`, `mops check --fix`, `mops build`; bindings from root `pnpm bindgen`.
- xlsx (SheetJS) 0.18.5 ships its own types; `aoa_to_sheet` rejects a readonly tuple, so spread the header array into a mutable one.
- Export controls must fetch records on demand (queryClient.fetchQuery with staleTime 0) instead of depending on a pre-loaded list, so they work before the form is opened; a disabled export button with no visible state reads as broken.
- OQL auto-derive needs top-level imports: Entity, MapEntity, RecordValue and one <Type>Value per primitive field; use .public_() for open, no-sign-in data.
- biome lint/a11y/useSemanticElements requires <output> instead of a div with role=status for success messages.
- index.html lang stays 'en' from the template; a Spanish-only app should set lang="es" for correct screen-reader pronunciation.
- Decorative Tailwind animations (animate-float/fade-up/pulse) need motion-safe: or motion-reduce:animate-none to honor prefers-reduced-motion.
- getApiDoc must name /.well-known/ii-derivation-origin in its auth section even when every method is anonymous.
- A download-only export never renders record text; a browser flow that checks a saved value needs the fetched records rendered on the page, not just written to the .xlsx file.
- The event date and time shown in the event details list is a hardcoded EVENT_FACTS entry in src/frontend/src/pages/Home.tsx (label 'Fecha'); it is not stored in the backend.
- The event location is the 'Lugar' entry in the module-level EVENT_FACTS array in src/frontend/src/pages/Home.tsx, rendered via a <dl> map; the event date and topic are sibling entries in the same array.
- El recordatorio programado vive en src/backend/lib/reminder.mo (constantes scheduledAt y notice) y se arma con un temporizador del backend; el aviso y la hora programada deben coincidir siempre.
- recipients() deduplica por número de teléfono y no exige correo, así que un registro con teléfono y sin correo también recibe el aviso.
- La página /recordatorio está protegida por inicio de sesión y por el rol de administrador; useIsCallerAdmin() devuelve false para visitantes anónimos sin lanzar error.
- ReminderInfo.scheduledAt es un bigint en nanosegundos; dividir entre 1_000_000n antes de new Date y formatear con Intl es-VE.
- SendOutcome es una unión __kind__ (sent/noRecipients/failed); renderizar cada rama como un estado distinto.
- El enrutado usa TanStack Router en modo código: rootRoute renderiza <Layout><Outlet/></Layout>, con '/' -> Home y '/recordatorio' -> Reminder; los anclajes de sección usan Link to='/' hash='...'.
- Las migraciones ya aplicadas son de solo lectura; el estado estable nuevo va en un archivo de migración nuevo con nombre posterior a todos los existentes.
