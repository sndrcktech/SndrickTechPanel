import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import { getToken } from "./api/auth";

import Layout from "./components/Layout";

const App: React.FC = () => {
  const [authState, setAuthState] = useState(!!getToken());

  const handleLogin = () => setAuthState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
		<Route
		  path="/services"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Services />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/profile"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Profile />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/logs"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Logs />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/notify"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Notify />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/firewall"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Firewall />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/backup"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Backup />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/mail"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Mail />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/dns"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Dns />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/audit"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Audit />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/change-password"
		  element={
			<ProtectedRoute>
			  <Layout>
				<ChangePassword />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/mfa"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Mfa />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/theme"
		  element={
			<ProtectedRoute>
			  <Layout>
				<ThemePage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
			<Route
			  path="/ca"
			  element={
				<ProtectedRoute>
				  <Layout>
					<CaPage />
				  </Layout>
				</ProtectedRoute>
			  }
			/>
		<Route
		  path="/vpn"
		  element={
			<ProtectedRoute>
			  <Layout>
				<VpnPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/ldap"
		  element={
			<ProtectedRoute>
			  <Layout>
				<LdapPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/metrics"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Metrics />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/logs-adv"
		  element={
			<ProtectedRoute>
			  <Layout>
				<LogsAdv />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/terminal"
		  element={
			<ProtectedRoute>
			  <Layout>
				<TerminalPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/wordpress"
		  element={
			<ProtectedRoute>
			  <Layout>
				<WordpressPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/backup2"
		  element={
			<ProtectedRoute>
			  <Layout>
				<Backup2 />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/update"
		  element={
			<ProtectedRoute>
			  <Layout>
				<UpdatePage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>

		<Route
		  path="/antivirus"
		  element={
			<ProtectedRoute>
			  <Layout>
				<AntivirusPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/agents"
		  element={
			<ProtectedRoute>
			  <Layout>
				<AgentsPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/push"
		  element={
			<ProtectedRoute>
			  <Layout>
				<PushPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/settings"
		  element={
			<ProtectedRoute>
			  <Layout>
				<SettingsPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/dns"
		  element={
			<ProtectedRoute>
			  <Layout>
				<DnsPage />
			  </Layout>
			</ProtectedRoute>
		  }
		/>

<Route
  path="/webhooks"
  element={
    <ProtectedRoute>
      <Layout>
        <WebhooksPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/rbac"
  element={
    <ProtectedRoute>
      <Layout>
        <RbacPage />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/audit"
  element={
    <ProtectedRoute>
      <Layout>
        <AuditPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/mailcert"
  element={
    <ProtectedRoute>
      <Layout>
        <MailCertPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/nginxcert"
  element={
    <ProtectedRoute>
      <Layout>
        <NginxCertPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/usercert"
  element={
    <ProtectedRoute>
      <Layout>
        <UserCertPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/letsencrypt"
  element={
    <ProtectedRoute>
      <Layout>
        <LetsencryptPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/certmanager"
  element={
    <ProtectedRoute>
      <Layout>
        <CertManagerPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/backup"
  element={
    <ProtectedRoute>
      <Layout>
        <BackupPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/backup_audit"
  element={
    <ProtectedRoute>
      <Layout>
        <BackupAuditPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/monitoring"
  element={
    <ProtectedRoute>
      <Layout>
        <MonitoringPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Layout>
        <NotificationsPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/webpush"
  element={
    <ProtectedRoute>
      <Layout>
        <WebPushPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/alertmatrix"
  element={
    <ProtectedRoute>
      <Layout>
        <AlertMatrixPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/alertmatrixrbac"
  element={
    <ProtectedRoute>
      <Layout>
        <AlertMatrixRBACPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/alerttemplates"
  element={
    <ProtectedRoute>
      <Layout>
        <AlertTemplatesPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/alerttest"
  element={
    <ProtectedRoute>
      <Layout>
        <AlertTestPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/alerttestlog"
  element={
    <ProtectedRoute>
      <Layout>
        <AlertTestLogPage />
      </Layout>
    </ProtectedRoute>
  }
/>



      </Routes>
    </BrowserRouter>
  );
};