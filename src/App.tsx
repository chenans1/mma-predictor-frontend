
export enum RoutePath {
  Home = "/",
  Events = "/events",
  About = "/about"
}

function HomePage() {
  return <h2>Model Dashboard</h2>;
}

function EventsPage() {
  return <h2>Upcoming Events</h2>;
}

function AboutPage() {
  return <h2>About the Project</h2>;
}

export default function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path={RoutePath.Home} element={<HomePage />} />
          <Route path={RoutePath.Events} element={<EventsPage />} />
          <Route path={RoutePath.About} element={<AboutPage />} />
        </Routes>
      </main>
    </>
  );
}