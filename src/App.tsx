import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/shared/auth/ProtectedRoute'
import { AppLayout } from '@/shared/layout/AppLayout'
import { useAuth } from '@/shared/auth/AuthContext'
import { LoginPage } from '@/modules/acceso/pages/LoginPage'
import { UsuariosPage } from '@/modules/acceso/pages/UsuariosPage'
import { RolesPage } from '@/modules/acceso/pages/RolesPage'
import { PerfilPage } from '@/modules/acceso/pages/PerfilPage'
import { ConvocatoriasPage } from '@/modules/administrativo/pages/ConvocatoriasPage'
import { DashboardPage } from '@/modules/administrativo/pages/DashboardPage'
import { AulasPage } from '@/modules/academico/pages/AulasPage'
import { DocentesPage } from '@/modules/academico/pages/DocentesPage'
import { GruposPage } from '@/modules/academico/pages/GruposPage'
import { CarrerasPage } from '@/modules/examenes/pages/CarrerasPage'
import { MateriasPage } from '@/modules/academico/pages/MateriasPage'
import { MiHorarioPage } from '@/modules/academico/pages/MiHorarioPage'
import { MisExamenesPage } from '@/modules/examenes/pages/MisExamenesPage'
import { ResultadosPage } from '@/modules/examenes/pages/ResultadosPage'
import { CortePage } from '@/modules/examenes/pages/CortePage'
import { HistorialPage } from '@/modules/examenes/pages/HistorialPage'
import { ReportesPage } from '@/modules/examenes/pages/ReportesPage'
import { PostulantesPage } from '@/modules/registro/pages/PostulantesPage'
import { LandingPage } from '@/modules/postulacion/pages/LandingPage'
import { PostulacionPage } from '@/modules/postulacion/pages/PostulacionPage'
import { PaymentSearchPage } from '@/modules/pagos/pages/PaymentSearchPage'
import { PaymentHistoryPage } from '@/modules/pagos/pages/PaymentHistoryPage'
import { PagosReportPage } from '@/modules/pagos/pages/PagosReportPage'
import { BitacoraPage } from '@/modules/bitacora/pages/BitacoraPage'

/** Aterrizaje tras iniciar sesión: gerencia al dashboard, staff a Usuarios, resto a su perfil. */
function HomeRedirect() {
  const { tienePermiso } = useAuth()
  if (tienePermiso('dashboard.index')) return <Navigate to="/dashboard" replace />
  return <Navigate to={tienePermiso('usuarios.index') ? '/usuarios' : '/perfil'} replace />
}

function App() {
  return (
    <Routes>
      {/* Públicas (sin sesión): landing FICCT, postulación y pago de inscripción. */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/postular" element={<PostulacionPage />} />
      <Route path="/pagar" element={<PaymentSearchPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/inicio" element={<HomeRedirect />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute permiso="dashboard.index">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute permiso="usuarios.index">
              <UsuariosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute permiso="roles.index">
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/postulantes"
          element={
            <ProtectedRoute permiso="postulantes.index">
              <PostulantesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/convocatorias"
          element={
            <ProtectedRoute permiso="gestiones.index">
              <ConvocatoriasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aulas"
          element={
            <ProtectedRoute permiso="aulas.index">
              <AulasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carreras"
          element={
            <ProtectedRoute permiso="carreras.index">
              <CarrerasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materias"
          element={
            <ProtectedRoute permiso="materias.index">
              <MateriasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docentes"
          element={
            <ProtectedRoute permiso="docentes.index">
              <DocentesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grupos"
          element={
            <ProtectedRoute permiso="grupos.index">
              <GruposPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horario"
          element={
            <ProtectedRoute permiso="horario.index">
              <MiHorarioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-examenes"
          element={
            <ProtectedRoute permiso="examenes.rendir">
              <MisExamenesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resultados"
          element={
            <ProtectedRoute permiso="notas.index">
              <ResultadosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/corte"
          element={
            <ProtectedRoute permiso="admision.index">
              <CortePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <ProtectedRoute permiso="historial.index">
              <HistorialPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/academicos"
          element={
            <ProtectedRoute permiso="reportes.index">
              <ReportesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/pagos" element={<PaymentHistoryPage />} />
        <Route
          path="/reportes/pagos"
          element={
            <ProtectedRoute permiso="pagos.reportes">
              <PagosReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bitacora"
          element={
            <ProtectedRoute permiso="bitacora.index">
              <BitacoraPage />
            </ProtectedRoute>
          }
        />
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
