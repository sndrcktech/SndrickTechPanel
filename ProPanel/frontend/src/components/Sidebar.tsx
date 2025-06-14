import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../api/auth";
import { getLogoUrl } from "../api/ui";
import ThemeSwitcher from "./ThemeSwitcher";


const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  return (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col py-6 px-4">
      <div className="mb-8 flex items-center gap-3">
		  <img src={getLogoUrl()} alt="logo" className="w-12 h-12 rounded bg-white" />
		  <div>
			<div className="text-2xl font-extrabold tracking-widest text-blue-400 mb-2">
			  SandrickTechPanel
			</div>
			<div className="text-xs text-gray-400 mb-4">v2.4.1</div>
		    </div>
	  </div>

      <nav className="flex-1">
        <ul>
          <li>
            <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/">
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/users">
              Пользователи
            </Link>
          </li>
		  <li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/profile">
				Профиль
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/services">
				Сервисы
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/logs">
				Логи
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/notify">
				Telegram
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/firewall">
				Фаервол
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/backup">
				Бэкапы
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/mail">
				Почта
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/dns">
				DNS
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/audit">
				Журнал действий
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/change-password">
				Смена пароля
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/theme">
				Настройки темы
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/ca">
				Центр сертификации
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/vpn">
				VPN
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/ldap">
				LDAP
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/metrics">
				Мониторинг
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/logs-adv">
				Логи (расшир.)
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/terminal">
				Терминал
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/wordpress">
				WordPress
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/backup2">
				Бэкапы
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/update">
				Обновление
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/antivirus">
				Антивирус
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/agents">
				Агенты
			  </Link>
			</li>
			<li>
			  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/push">
				Push (PWA)
			  </Link>
			</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/settings">
    Настройки
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/dns">
    DNS
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/webhooks">
    Webhooks
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/rbac">
    Пользователи и роли
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/audit">
    Audit Log
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/mailcert">
    Почтовый сертификат
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/nginxcert">
    Сертификаты Nginx
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/usercert">
    User сертификаты
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/letsencrypt">
    Let's Encrypt
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/certmanager">
    Сертификаты (таблица)
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/backup">
    Бэкапы
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/backup_audit">
    Журнал Backup/Restore
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/monitoring">
    Мониторинг/Alerts
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/notifications">
    Оповещения
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/webpush">
    Web Push
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/alertmatrix">
    Матрица оповещений
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/alertmatrixrbac">
    RBAC Alert Matrix
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/alerttemplates">
    Шаблоны алертов
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/alerttest">
    Тест алертов
  </Link>
</li>
<li>
  <Link className="block py-2 px-2 hover:bg-gray-800 rounded" to="/alerttestlog">
    Журнал тест-алертов
  </Link>
</li>

  

          {/* Добавляй сюда новые пункты меню */}
        </ul>
      </nav>
      <div>
        {getToken() && (
          <button
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white mt-8"
            onClick={handleLogout}
          >
            Выйти
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
