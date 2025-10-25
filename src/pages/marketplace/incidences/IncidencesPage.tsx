import MyIncidencesPage from "./MyIncidencesPage";
import PendingIncidencesPage from "./PendingIncidencesPage";

export default function IncidencesPage() {
  return (
    <div>
      <PendingIncidencesPage />
      <MyIncidencesPage />
    </div>
  );
}
