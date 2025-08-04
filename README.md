# 📝 Penmark – Aplicación de Notas con Sentimientos

## 🎯 Objetivo

Construir una aplicación web que permita **crear** y **leer** notas categorizadas por un sentimiento. La aplicación debe ser funcional, estar desplegada en producción, y utilizar tecnologías modernas como GraphQL, AppSync y DynamoDB. Opcionalmente, se puede extender con analítica y despliegue de backend como infraestructura como código.

---

## 🧱 Contenido del Repositorio

```
.
├── README.md
├── website/              # Frontend: React + Next.js + TailwindCSS
```

El frontend está desplegado en producción mediante **AWS Amplify**.

---

## 🖥️ Requisitos Funcionales

La aplicación permite:

1. **Crear una nota**, incluyendo:
   - Texto libre
   - Sentimiento asociado: `happy`, `sad`, `neutral`, `angry`
2. **Visualizar notas existentes**:
   - Paginación en bloques de 10
   - Filtro por sentimiento
   - Visualización de fecha de creación
3. **Despliegue**:
   - Producción activa en AWS Amplify

---

## ⚙️ Requisitos Técnicos

- **Frontend**: [React](https://react.dev/) con [Next.js](https://nextjs.org/) y [Tailwind CSS](https://tailwindcss.com/)
- **API**: [GraphQL](https://aws.amazon.com/graphql/) sobre [AppSync](https://aws.amazon.com/appsync/)
- **Base de datos**: [DynamoDB](https://aws.amazon.com/dynamodb/)
- **Hosting**: [Amplify](https://aws.amazon.com/amplify/hosting/)

### 🔧 Esquema GraphQL Esperado

```graphql
enum Sentiment {
  happy
  sad
  neutral
  angry
}

type Note {
  id: ID!
  text: String!
  sentiment: Sentiment!
  dateCreated: AWSDateTime!
}

type NoteQueryResults {
  items: [Note]
  nextToken: String
  scannedCount: Int
}

type Query {
  getNotes(sentiment: Sentiment, limit: Int, nextToken: String): NoteQueryResults
}

type Mutation {
  createNote(text: String!, sentiment: Sentiment!): Note
}
```

---

## ✅ Entregables

- 🔗 URL desplegada (AWS Amplify)
- 💻 Enlace al repositorio forked con el código fuente

---

## 👨‍💻 Desarrollo Técnico

### Día 1

- Se eligió **DaisyUI** por su rápida integración con TailwindCSS y componentes prediseñados, lo que redujo la necesidad de escribir CSS personalizado.
- Se creó una maqueta rápida en **Figma** para visualizar la interfaz.
- Estudio intensivo de **DynamoDB** para comprender su estructura, usando la consola gráfica para crear la tabla `Notes` con claves compuestas: `sentiment` (partición) y un `ULID` como ordenamiento para facilitar queries por sentimiento.
- Investigación de **GraphQL** y su implementación en **AppSync**, creación de esquema y testeo desde la consola con JavaScript.

### Día 2

- Creación del proyecto frontend con **Next.js**, **React** y **TypeScript**.
- Estructura basada en documentación oficial, separando componentes (`components/`), queries (`lib/graphql/`), tipos (`types/`), utilidades (`utils/`) y vistas (`app/`).
- Uso de **Apollo Client** por su sencillez y velocidad de implementación para trabajar con GraphQL.
- Implementación del renderizado del lado del cliente (CSR) para facilitar la lógica de filtrado.
- Paginación implementada para cargar más notas bajo demanda.

### Día 3

- Despliegue en **AWS Amplify** usando variables de entorno para proteger las API Keys.
- Configuración de entorno productivo con rama `main`, dejando `development` para iteraciones futuras.
- Configuración de comandos y despliegue exitoso.

---

## ✍️ Reflexión Personal

Desde el inicio, fui consciente de que no tenía experiencia previa con muchas de las tecnologías utilizadas en este reto —especialmente con servicios como AWS AppSync, DynamoDB, o el uso de GraphQL en producción—, pero eso no me detuvo. Me comprometí a aprender sobre la marcha y a dar lo mejor de mí para completar el proyecto en un periodo corto de tiempo.

Durante el desarrollo, utilicé herramientas de inteligencia artificial como ChatGPT y GitHub Copilot no como atajos, sino como acompañantes de aprendizaje: cada fragmento de código sugerido fue leído, comprendido y adaptado según el contexto específico de mi aplicación. Este proceso no solo me permitió avanzar más rápido, sino también aprender con mayor profundidad en tiempo real.

Me enfrenté a varios retos técnicos que nunca había abordado, como el diseño de una base de datos en DynamoDB, la implementación de esquemas GraphQL, la gestión de datos paginados, el uso de Apollo Client, o la diferencia entre renderizado del lado del cliente y del servidor en Next.js. Cada obstáculo fue una oportunidad de crecimiento, y aunque no llegué a completar los entregables opcionales (como la analítica o el despliegue del backend como infraestructura como código), planeo desarrollarlos posteriormente como parte de mi formación continua.

Fueron días intensos, con jornadas largas desde temprano por la mañana hasta entrada la madrugada. Sin embargo, me siento muy satisfecho con lo logrado. No solo terminé con una aplicación funcional en producción, sino que adquirí conocimientos valiosos que sé que usaré en futuros proyectos.

Gracias sinceramente por esta oportunidad. Más allá del resultado, este reto me brindó una visión más realista del trabajo con tecnologías modernas y de cómo adaptarse rápidamente a entornos que exigen aprendizaje continuo. Por mi parte, seguiré trabajando para mejorar este proyecto y mis habilidades, porque disfruto el proceso de aprender construyendo.

---

## 🚀 Mejoras Propuestas

- 🔐 Implementar **AWS Cognito** para permitir autenticación y notas privadas por usuario.
- 📅 Mejorar ordenamiento de notas por fecha desde el cliente.
- 🛠️ Agregar operaciones CRUD completas: editar y eliminar notas.
- 🧱 Mostrar componente Skeleton mientras se cargan notas.
- ⚙️ Refinar el renderizado híbrido (CSR/SSR) para optimizar la UX.

---

## 🗂️ Estructura del Proyecto

```
src/
├── app/                # Rutas y páginas (Next.js app dir)
│   └── notes/
├── components/         # Componentes React
│   ├── blocks/         # Componentes compuestos
│   ├── layout/         # Layouts reutilizables
│   └── ui/             # Elementos UI simples (botones, inputs)
├── lib/                # Cliente Apollo y queries GraphQL
│   └── graphql/
├── types/              # Tipado compartido
├── utils/              # Funciones comunes (fechas, ordenamiento)
```

---