import {
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	MagnifyingGlassIcon,
	TicketIcon,
	TrashIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const User = () => {
	const { auth } = useContext(AuthContext)
	const [users, setUsers] = useState(null)
	const [ticketsUser, setTicketsUser] = useState(null)
	const [tickets, setTickets] = useState([])
	const [isUpdating, SetIsUpdating] = useState(false)
	const [isDeleting, SetIsDeleting] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const fetchUsers = async (data) => {
		try {
			// setIsFetchingShowtimesDone(false)
			const response = await axios.get('/auth/user', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data.data)
			setUsers(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			// setIsFetchingShowtimesDone(true)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const onUpdateUser = async (data) => {
		try {
			SetIsUpdating(true)
			const response = await axios.put(`/auth/user/${data.id}`, data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchUsers()
			toast.success(`Update ${response.data.data.username} to ${response.data.data.role} successful!`, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsUpdating(false)
		}
	}

	const handleDelete = (data) => {
		const confirmed = window.confirm(`Do you want to delete user ${data.username}?`)
		if (confirmed) {
			onDeleteUser(data)
		}
	}

	const onDeleteUser = async (data) => {
		try {
			SetIsDeleting(true)
			const response = await axios.delete(`/auth/user/${data.id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchUsers()
			toast.success(`Delete successful!`, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsDeleting(false)
		}
	}

	return (
		<div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-purple-900 to-pink-800 pb-12 text-gray-900 sm:gap-10">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-100 p-6 shadow-xl sm:mx-8 sm:p-8">
				<h2 className="text-3xl font-bold tracking-tight text-gray-800">Quản lý người dùng</h2>
				<div className="relative shadow-sm">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon className="h-6 w-6 stroke-2 text-gray-500" />
					</div>
					<input
						type="search"
						className="block w-full rounded-xl border-2 border-gray-300 p-3 pl-12 text-lg text-gray-900 shadow-sm transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
						placeholder="Tìm kiếm tên đăng nhập"
						{...register('search')}
					/>
				</div>
				<div
					className={`mt-4 grid max-h-[60vh] overflow-auto rounded-xl bg-gradient-to-br from-purple-100 to-white shadow-lg`}
					style={{ gridTemplateColumns: 'repeat(3, minmax(max-content, 1fr)) max-content max-content' }}
				>
					<p className="sticky top-0 bg-gradient-to-br from-purple-800 to-pink-700 px-4 py-2 text-center text-xl font-semibold text-white">
						Tên đăng nhập
					</p>
					<p className="sticky top-0 bg-gradient-to-br from-purple-800 to-pink-700 px-4 py-2 text-center text-xl font-semibold text-white">
						Email
					</p>
					<p className="sticky top-0 bg-gradient-to-br from-purple-800 to-pink-700 px-4 py-2 text-center text-xl font-semibold text-white">
						Vai trò
					</p>
					<p className="sticky top-0 bg-gradient-to-br from-purple-800 to-pink-700 px-4 py-2 text-center text-xl font-semibold text-white">
						Vé
					</p>
					<p className="sticky top-0 bg-gradient-to-br from-purple-800 to-pink-700 px-4 py-2 text-center text-xl font-semibold text-white">
						Thao tác
					</p>
					{users
						?.filter((user) => user.username.toLowerCase().includes(watch('search')?.toLowerCase() || ''))
						.map((user, index) => {
							return (
								<Fragment key={index}>
									<div className="border-t-2 border-purple-200 px-4 py-2 text-gray-700">{user.username}</div>
									<div className="border-t-2 border-purple-200 px-4 py-2 text-gray-700">{user.email}</div>
									<div className="border-t-2 border-purple-200 px-4 py-2 text-gray-700">{user.role}</div>
									<div className="border-t-2 border-purple-200 px-4 py-2">
										<button
											className={`flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2 text-base font-medium text-white shadow-md transition-all duration-300 hover:scale-105 disabled:from-slate-500 disabled:to-slate-400
										${
											ticketsUser === user.username
												? 'from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400'
												: 'from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400'
										}`}
											onClick={() => {
												setTickets(user.tickets)
												setTicketsUser(user.username)
											}}
										>
											Xem {user.tickets.length} vé
											<TicketIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
										</button>
									</div>
									<div className="flex gap-3 border-t-2 border-purple-200 px-4 py-2">
										{user.role === 'user' && (
											<button
												className="flex w-[130px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-base font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 disabled:from-slate-500 disabled:to-slate-400"
												onClick={() => onUpdateUser({ id: user._id, role: 'admin' })}
												disabled={isUpdating}
											>
												Đặt Admin
												<ChevronDoubleUpIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
											</button>
										)}
										{user.role === 'admin' && (
											<button
												className="flex w-[130px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-base font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 disabled:from-slate-500 disabled:to-slate-400"
												onClick={() => onUpdateUser({ id: user._id, role: 'user' })}
												disabled={isUpdating}
											>
												Đặt User
												<ChevronDoubleDownIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
											</button>
										)}
										<button
											className="flex w-[130px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-700 to-rose-600 px-4 py-2 text-base font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-rose-500 disabled:from-slate-500 disabled:to-slate-400"
											onClick={() => handleDelete({ id: user._id, username: user.username })}
											disabled={isDeleting}
										>
											Xóa
											<TrashIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
										</button>
									</div>
								</Fragment>
							)
						})}
				</div>
				{ticketsUser && (
					<>
						<h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-800">Xem vé của {ticketsUser}</h2>
						{tickets.length === 0 ? (
							<p className="text-center text-lg text-gray-700">Người dùng này chưa mua vé nào</p>
						) : (
							<div className="grid grid-cols-1 gap-6 xl:grid-cols-2 min-[1920px]:grid-cols-3">
								{tickets.map((ticket, index) => {
									return (
										<div className="flex flex-col transition-all duration-300 hover:scale-[1.02]" key={index}>
											<ShowtimeDetails showtime={ticket.showtime} />
											<div className="flex h-full flex-col justify-between rounded-b-xl bg-gradient-to-br from-purple-100 to-white text-center text-lg shadow-lg md:flex-row">
												<div className="flex h-full flex-col items-center gap-x-4 px-6 py-3 md:flex-row">
													<p className="whitespace-nowrap font-semibold text-gray-800">Ghế: </p>
													<p className="text-gray-700">
														{ticket.seats.map((seat) => seat.row + seat.number).join(', ')}
													</p>
													<p className="whitespace-nowrap text-gray-600">({ticket.seats.length} ghế)</p>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default User
