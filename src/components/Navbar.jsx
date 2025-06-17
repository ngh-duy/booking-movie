import {
	ClockIcon,
	HomeModernIcon,
	MagnifyingGlassIcon,
	TicketIcon,
	UsersIcon,
	VideoCameraIcon
} from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
	const { auth, setAuth } = useContext(AuthContext)
	const [menuOpen, setMenuOpen] = useState(false)
	const [isLoggingOut, SetLoggingOut] = useState(false)

	const toggleMenu = () => {
		setMenuOpen(!menuOpen)
	}

	const navigate = useNavigate()

	const onLogout = async () => {
		try {
			SetLoggingOut(true)
			const response = await axios.get('/auth/logout')
			setAuth({ username: null, email: null, role: null, token: null })
			sessionStorage.clear()
			navigate('/')
			toast.success('Đăng xuất thành công!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Lỗi', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetLoggingOut(false)
		}
	}

	const menuLists = () => {
		return (
			<>
				<div className="flex flex-col gap-3 lg:flex-row">
					<Link
						to={'/cinema'}
						className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-300 hover:bg-gray-500 ${
							window.location.pathname === '/cinema'
								? 'bg-gradient-to-br from-purple-800 to-pink-700 shadow-lg'
								: 'bg-gray-600'
						}`}
					>
						<HomeModernIcon className="h-6 w-6" />
						<p>Rạp Chiếu</p>
					</Link>
					<Link
						to={'/schedule'}
						className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-300 hover:bg-gray-500 ${
							window.location.pathname === '/schedule'
								? 'bg-gradient-to-br from-purple-800 to-pink-700 shadow-lg'
								: 'bg-gray-600'
						}`}
					>
						<ClockIcon className="h-6 w-6" />
						<p>Lịch Chiếu</p>
					</Link>
					{auth.role && (
						<Link
							to={'/ticket'}
							className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-300 hover:bg-gray-500 ${
								window.location.pathname === '/ticket'
									? 'bg-gradient-to-br from-purple-800 to-pink-700 shadow-lg'
									: 'bg-gray-600'
							}`}
						>
							<TicketIcon className="h-6 w-6" />
							<p>Vé</p>
						</Link>
					)}
					{auth.role === 'admin' && (
						<>
							<Link
								to={'/movie'}
								className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-300 hover:bg-gray-500 ${
									window.location.pathname === '/movie'
										? 'bg-gradient-to-br from-purple-800 to-pink-700 shadow-lg'
										: 'bg-gray-600'
								}`}
							>
								<VideoCameraIcon className="h-6 w-6" />
								<p>Phim</p>
							</Link>
							<Link
								to={'/search'}
								className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-300 hover:bg-gray-500 ${
									window.location.pathname === '/search'
										? 'bg-gradient-to-br from-purple-800 to-pink-700 shadow-lg'
										: 'bg-gray-600'
								}`}
							>
								<MagnifyingGlassIcon className="h-6 w-6" />
								<p>Tìm Kiếm</p>
							</Link>
							<Link
								to={'/user'}
								className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-300 hover:bg-gray-500 ${
									window.location.pathname === '/user'
										? 'bg-gradient-to-br from-purple-800 to-pink-700 shadow-lg'
										: 'bg-gray-600'
								}`}
							>
								<UsersIcon className="h-6 w-6" />
								<p>Người Dùng</p>
							</Link>
						</>
					)}
				</div>
				<div className="flex grow items-center justify-center gap-4 lg:justify-end">
					{auth.username && (
						<p className="text-md whitespace-nowrap leading-none text-white">Xin chào {auth.username}!</p>
					)}
					{auth.token ? (
						<button
							className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-pink-400 disabled:from-slate-500 disabled:to-slate-400"
							onClick={() => onLogout()}
							disabled={isLoggingOut}
						>
							{isLoggingOut ? 'Đang xử lý...' : 'Đăng Xuất'}
						</button>
					) : (
						<button className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-pink-400">
							<Link to={'/login'}>Đăng Nhập</Link>
						</button>
					)}
				</div>
			</>
		)
	}

	return (
		<nav className="flex flex-col items-center justify-between gap-3 bg-gradient-to-r from-purple-900 to-pink-800 px-6 py-4 shadow-xl lg:flex-row lg:justify-start sm:px-10">
			<div className="flex w-full flex-row justify-between lg:w-fit">
				<button className="flex flex-row items-center gap-3 transition-transform hover:scale-105" onClick={() => navigate('/')}>
					<TicketIcon className="h-9 w-9 text-white" />
					<h1 className="mr-2 text-2xl font-semibold text-white">NOBITA</h1>
				</button>
				<button
					className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-purple-700/50 lg:hidden"
					onClick={() => toggleMenu()}
				>
					<Bars3Icon className="h-7 w-7 text-white" />
				</button>
			</div>
			<div className="hidden grow justify-between gap-3 lg:flex">{menuLists()}</div>
			{menuOpen && <div className="flex w-full grow flex-col gap-3 lg:hidden">{menuLists()}</div>}
		</nav>
	)
}

export default Navbar
