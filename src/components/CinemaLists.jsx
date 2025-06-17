import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from './Loading'

const CinemaLists = ({
	cinemas,
	selectedCinemaIndex,
	setSelectedCinemaIndex,
	fetchCinemas,
	auth,
	isFetchingCinemas = false
}) => {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const [isAdding, SetIsAdding] = useState(false)

	const onAddCinema = async (data) => {
		try {
			SetIsAdding(true)
			const response = await axios.post('/cinema', data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			reset()
			fetchCinemas(data.name)
			toast.success('Thêm rạp chiếu thành công!', {
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
			SetIsAdding(false)
		}
	}

	const CinemaLists = ({ cinemas }) => {
		const cinemasList = cinemas?.filter((cinema) =>
			cinema.name.toLowerCase().includes(watch('search')?.toLowerCase() || '')
		)

		return cinemasList.length ? (
			cinemasList.map((cinema, index) => {
				return cinemas[selectedCinemaIndex]?._id === cinema._id ? (
					<button
						className="w-fit transform rounded-xl bg-gradient-to-br from-purple-800 to-pink-700 px-4 py-2 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-600 active:scale-95"
						onClick={() => {
							setSelectedCinemaIndex(null)
							sessionStorage.setItem('selectedCinemaIndex', null)
						}}
						key={index}
					>
						{cinema.name}
					</button>
				) : (
					<button
						className="w-fit transform rounded-xl bg-gradient-to-br from-purple-800 to-pink-700 px-3 py-1.5 text-base font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-600 active:scale-95"
						onClick={() => {
							setSelectedCinemaIndex(index)
							sessionStorage.setItem('selectedCinemaIndex', index)
						}}
						key={index}
					>
						{cinema.name}
					</button>
				)
			})
		) : (
			<div className="text-lg font-medium text-gray-600">Không tìm thấy rạp chiếu</div>
		)
	}

	return (
		<>
			<div className="mx-4 flex h-fit flex-col gap-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 p-6 text-gray-900 shadow-2xl sm:mx-8 sm:p-8">
				<form
					className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4"
					onSubmit={handleSubmit(onAddCinema)}
				>
					<h2 className="text-3xl font-bold tracking-tight text-gray-800">Danh Sách Rạp Chiếu</h2>
					{auth.role === 'admin' && (
						<div className="flex w-fit grow sm:justify-end">
							<input
								placeholder="Nhập tên rạp chiếu"
								className="w-full grow rounded-l-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 sm:max-w-xs"
								required
								{...register('name', { required: true })}
							/>
							<button
								disabled={isAdding}
								className="flex items-center whitespace-nowrap rounded-r-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:from-purple-500 hover:to-pink-400 disabled:from-slate-500 disabled:to-slate-400"
							>
								{isAdding ? 'Đang xử lý...' : 'THÊM +'}
							</button>
						</div>
					)}
				</form>
				<div className="relative">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
						<MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-gray-400" />
					</div>
					<input
						type="search"
						className="block w-full rounded-xl border border-gray-300 p-3 pl-12 text-gray-700 shadow-sm transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
						placeholder="Tìm kiếm rạp chiếu"
						{...register('search')}
					/>
				</div>
				{isFetchingCinemas ? (
					<Loading />
				) : (
					<div className="flex flex-wrap items-center gap-4">
						<CinemaLists cinemas={cinemas} />
					</div>
				)}
			</div>
		</>
	)
}

export default CinemaLists
