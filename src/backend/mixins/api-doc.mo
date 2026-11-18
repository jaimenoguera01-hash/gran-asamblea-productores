mixin () {
  public query func getApiDoc() : async Text {
    "# API de Registro de Asistencia y Recordatorio — Gran Asamblea de Productores\n" #
    "\n" #
    "Backend del evento \"Gran Asamblea de Productores: El Arroz en crisis\" del partido Vente Venezuela, Municipio Francisco de Miranda. Almacena de forma permanente los registros de asistencia, los expone para su descarga como tabla (Excel/CSV) y envía un recordatorio programado por correo electrónico.\n" #
    "\n" #
    "## Propósito\n" #
    "\n" #
    "El canister guarda cada registro de asistencia con los campos: nombre y apellido, cédula de identidad (con prefijo V), teléfono, email, municipio y parroquia, más la fecha y hora del registro. Los registros persisten entre actualizaciones del canister. Además, un temporizador del backend dispara automáticamente un recordatorio el 27 de noviembre de 2026 a las 12:00 del mediodía (hora de Venezuela) a los correos de los asistentes registrados.\n" #
    "\n" #
    "## Autenticación y autorización\n" #
    "\n" #
    "- `registerAttendance` es **abierto**: cualquier visitante, incluido un llamador anónimo, puede registrar su asistencia sin iniciar sesión.\n" #
    "- `listAttendance` es una consulta **abierta**: cualquier llamador puede leer todos los registros para exportarlos.\n" #
    "- `getReminderInfo` y `sendReminderNow` son **solo para administradores**: exigen un llamador con sesión iniciada y rol `admin`. Un llamador anónimo o sin rol de administrador recibe un rechazo con el mensaje `Unauthorized: only administrators can read the reminder info` o `Unauthorized: only administrators can send the reminder`.\n" #
    "- El primer principal que se registra mediante el sistema de autorización de la plataforma recibe el rol `admin`; los siguientes reciben `user`. Un llamador que nunca se registró (aunque pertenezca al propietario de la app) no tiene rol y es rechazado en los métodos de administrador.\n" #
    "- El frontend fija un origen de derivación de Internet Identity, publicado en `/.well-known/ii-derivation-origin`. Un agente que ya tenga la autorización de Internet Identity del usuario deriva el principal correcto por aplicación contra ese origen (por ejemplo `icp identity link web <nombre> --app <host>`). Esa delegación actúa con toda la autoridad del usuario en esta app hasta que expire.\n" #
    "\n" #
    "## Métodos públicos\n" #
    "\n" #
    "### `registerAttendance(input : AttendanceInput) : async Attendance`\n" #
    "\n" #
    "Registra una asistencia y devuelve el registro almacenado.\n" #
    "\n" #
    "- `input` es un registro con los campos: `fullName`, `cedula`, `phone`, `email`, `municipio`, `parroquia` (todos `text`).\n" #
    "- El canister asigna `id` (entero sin signo, incremental) y `registeredAt` (marca de tiempo en nanosegundos desde la época Unix, `int`).\n" #
    "- Es una llamada de actualización (update): persiste el registro de forma permanente.\n" #
    "- **Reintentos:** no es idempotente. Cada llamada crea un registro nuevo con un `id` distinto. Si el cliente reintenta tras un error de red, puede duplicar la asistencia; verifique el resultado antes de reintentar.\n" #
    "\n" #
    "### `listAttendance() : async [Attendance]`\n" #
    "\n" #
    "Devuelve todos los registros de asistencia ordenados por fecha de registro (ascendente).\n" #
    "\n" #
    "- Es una consulta (query): rápida y de solo lectura.\n" #
    "- Cada elemento incluye `id`, `fullName`, `cedula`, `phone`, `email`, `municipio`, `parroquia` y `registeredAt`.\n" #
    "- Úsela para generar la tabla descargable (Excel/CSV) en el navegador.\n" #
    "\n" #
    "### `getReminderInfo() : async ReminderInfo`\n" #
    "\n" #
    "Devuelve la programación del recordatorio. **Solo administradores.**\n" #
    "\n" #
    "- Es una consulta (query).\n" #
    "- `ReminderInfo` contiene: `scheduledAt` (`int`, nanosegundos desde la época Unix), `notice` (`text`, el aviso exacto que se envía) y `recipientCount` (`nat`, número de destinatarios con un número de teléfono registrado, sin duplicados).\n" #
    "\n" #
    "### `sendReminderNow() : async SendOutcome`\n" #
    "\n" #
    "Dispara el recordatorio de inmediato. **Solo administradores.**\n" #
    "\n" #
    "- Es una llamada de actualización (update).\n" #
    "- `SendOutcome` es una variante: `#sent({ recipients : nat })` si el envío tuvo éxito, `#noRecipients` si ningún registro tiene teléfono registrado, o `#failed(text)` con el mensaje de error si el envío falló.\n" #
    "- **Reintentos:** el recordatorio se envía **una sola vez**. Tras un envío exitoso, cualquier llamada posterior devuelve `#failed(\"El recordatorio ya fue enviado.\")`. Un envío fallido no marca el recordatorio como enviado, por lo que puede reintentarse.\n" #
    "\n" #
    "## Unidades y codificación\n" #
    "\n" #
    "- `registeredAt` y `scheduledAt` son `int` en **nanosegundos** desde la época Unix. Para mostrarlos como fecha, divídalos entre 1 000 000 000 para obtener segundos.\n" #
    "- `id` es un `nat` (entero sin signo) que comienza en 0.\n" #
    "- Todos los campos de texto son `text` UTF-8. La cédula se guarda como texto, normalmente con el prefijo `V`.\n" #
    "\n" #
    "## Ciclo de vida y sondeo\n" #
    "\n" #
    "- El recordatorio programado se arma al iniciar el canister y se dispara automáticamente en la fecha y hora pautadas, sin intervención manual.\n" #
    "- `registerAttendance` completa en una sola llamada y `listAttendance` refleja de inmediato los registros guardados.\n" #
    "- Para refrescar la lista o el estado del recordatorio, vuelva a llamar a `listAttendance` o `getReminderInfo`; no se requiere sondeo continuo.\n" #
    "\n" #
    "## Errores y límites\n" #
    "\n" #
    "- `registerAttendance` y `listAttendance` no devuelven variantes de error; una llamada correcta siempre devuelve el registro o la lista.\n" #
    "- `getReminderInfo` y `sendReminderNow` rechazan a los llamadores que no son administradores.\n" #
    "- `sendReminderNow` nunca reporta un envío fallido como exitoso: un error del servicio de correo se devuelve como `#failed(text)`.\n" #
    "- No hay validación de formato en el backend: el cliente debe validar cédula, teléfono y email antes de enviar.\n" #
    "- Los registros se conservan indefinidamente; no existe un método público para eliminarlos.\n" #
    "\n" #
    "## Consultas OQL\n" #
    "\n" #
    "El canister expone `schema()` y `execute()` a través de OQL. La entidad `attendance` es de lectura pública y refleja los mismos campos que `listAttendance`."
  };
};
