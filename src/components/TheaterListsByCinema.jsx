import {
	ArrowsRightLeftIcon,
	ArrowsUpDownIcon,
	CheckIcon,
	PencilSquareIcon,
	TrashIcon
} from '@heroicons/react/24/solid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DateSelector from './DateSelector'
import Theater from './Theater'

const TheaterListsByCinema = ({ cinemas, selectedCinemaIndex, setSelectedCinemaIndex, fetchCinemas, auth }) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const {
		register: registerName,
		handleSubmit: handleSubmitName,
		setValue: setValueName,
		formState: { errors: errorsName }
	} = useForm()

	const [movies, setMovies] = useState()
	const [selectedDate, setSelectedDate] = useState(
		(sessionStorage.getItem('selectedDate') && new Date(sessionStorage.getItem('selectedDate'))) || new Date()
	)
	const [isIncreasing, SetIsIncreaseing] = useState(false)
	const [isDeleting, SetIsDeleting] = useState(false)
	const [isDecreasing, SetIsDecreasing] = useState(false)
	const [isEditing, SetIsEditing] = useState(false)

	const fetchMovies = async (data) => {
		try {
			const response = await axios.get('/movie')
			// console.log(response.data.data)
			setMovies(response.data.data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	useEffect(() => {
		SetIsEditing(false)
		setValueName('name', cinemas[selectedCinemaIndex].name)
	}, [cinemas[selectedCinemaIndex].name])

	const handleDelete = (cinema) => {
		const confirmed = window.confirm(
			`Do you want to delete cinema ${cinema.name}, including its theaters, showtimes and tickets?`
		)
		if (confirmed) {
			onDeleteCinema(cinema._id)
		}
	}

	const onDeleteCinema = async (id) => {
		try {
			SetIsDeleting(true)
			const response = await axios.delete(`/cinema/${id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			setSelectedCinemaIndex(null)
			fetchCinemas()
			toast.success('Delete cinema successful!', {
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

	const onIncreaseTheater = async (data) => {
		try {
			SetIsIncreaseing(true)
			const response = await axios.post(
				`/theater`,
				{
					cinema: cinemas[selectedCinemaIndex]._id,
					number: cinemas[selectedCinemaIndex].theaters.length + 1,
					row: data.row.toUpperCase(),
					column: data.column
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			fetchCinemas()
			// console.log(response.data)
			toast.success('Add theater successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error(errors, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsIncreaseing(false)
		}
	}

	const handleDecreaseTheater = (cinema) => {
		const confirmed = window.confirm(
			`Do you want to delete theater ${cinemas[selectedCinemaIndex].theaters.length}, including its showtimes and tickets?`
		)
		if (confirmed) {
			onDecreaseTheater()
		}
	}

	const onDecreaseTheater = async () => {
		try {
			SetIsDecreasing(true)
			const response = await axios.delete(`/theater/${cinemas[selectedCinemaIndex].theaters.slice(-1)[0]._id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchCinemas()
			toast.success('Decrease theater successful!', {
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
			SetIsDecreasing(false)
		}
	}

	const onEditCinema = async (data) => {
		try {
			const response = await axios.put(
				`/cinema/${cinemas[selectedCinemaIndex]._id}`,
				{
					name: data.name
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			// console.log(response.data)
			fetchCinemas(data.name)
			toast.success('Edit cinema name successful!', {
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
		}
	}

	return (
		<div className="mx-4 h-fit rounded-2xl bg-gradient-to-br from-purple-200 to-pink-100 text-gray-900 shadow-xl sm:mx-8">
			<div className="flex items-center justify-center gap-3 rounded-t-2xl bg-gradient-to-br from-purple-900 to-pink-800 px-4 py-3 text-center text-2xl font-semibold text-white shadow-lg sm:py-4">
				{isEditing ? (
					<input
						title="Cinema name"
						type="text"
						required
						autoFocus
						className={`flex-grow rounded-lg border-2 border-white bg-gradient-to-br from-purple-900 to-pink-800 px-3 py-2 text-center text-2xl font-semibold shadow-md transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 sm:text-3xl ${
							errorsName.name && 'border-2 border-red-500'
						}`}
						{...registerName('name', { required: true })}
					/>
				) : (
					<span className="flex-grow text-2xl tracking-tight sm:text-3xl">{cinemas[selectedCinemaIndex]?.name}</span>
				)}
				{auth.role === 'admin' && (
					<>
						{isEditing ? (
							<form onClick={handleSubmitName(onEditCinema)}>
								<button
									title="Save cinema name"
									className="flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95"
									onClick={() => {
										SetIsEditing(false)
									}}
								>
									LƯU
									<CheckIcon className="h-5 w-5" />
								</button>
							</form>
						) : (
							<button
								title="Edit cinema name"
								className="flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95"
								onClick={() => SetIsEditing(true)}
							>
								CHỈNH SỬA
								<PencilSquareIcon className="h-5 w-5" />
							</button>
						)}
						<button
							title="Delete cinema"
							disabled={isDeleting}
							className="flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-red-700 to-rose-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-rose-500 active:scale-95 disabled:from-slate-500 disabled:to-slate-400"
							onClick={() => handleDelete(cinemas[selectedCinemaIndex])}
						>
							{isDeleting ? (
								'Đang xử lý...'
							) : (
								<>
									XÓA
									<TrashIcon className="h-5 w-5" />
								</>
							)}
						</button>
					</>
				)}
			</div>
			<div className="flex flex-col gap-8 p-6 sm:p-8 overflow-y-auto">
				<DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
				<form className="flex flex-col gap-6" onSubmit={handleSubmit(onIncreaseTheater)}>
					<h2 className="text-3xl font-bold tracking-tight text-gray-800">Rạp chiếu phim</h2>
					{auth.role === 'admin' && (
						<div className="flex w-full flex-wrap justify-between gap-6 rounded-xl bg-gradient-to-br from-purple-100 to-white p-6 shadow-lg">
							<h3 className="flex items-center text-2xl font-bold tracking-tight text-gray-800">Thêm rạp chiếu</h3>
							<div className="flex grow flex-col gap-6 sm:justify-end md:flex-row">
								<div className="flex flex-wrap justify-end gap-6">
									<div className="flex flex-wrap gap-3">
										<ArrowsUpDownIcon className="h-7 w-7 text-purple-600" />
										<div className="my-1 flex flex-col items-end">
											<label className="text-lg font-semibold leading-5 text-gray-800">Hàng cuối :</label>
											<label className="text-xs font-semibold text-gray-600">(A-DZ)</label>
										</div>
										<input
											title={errors.row ? errors.row.message : 'A to DZ'}
											type="text"
											maxLength="2"
											required
											className={`w-16 rounded-lg px-4 py-2 text-2xl font-semibold shadow-md transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400
											${errors.row && 'border-2 border-red-500'}`}
											{...register('row', {
												required: true,
												pattern: {
													value: /^([A-Da-d][A-Za-z]|[A-Za-z])$/,
													message: 'Invalid row'
												}
											})}
										/>
									</div>
									<div className="flex flex-wrap gap-3">
										<ArrowsRightLeftIcon className="h-7 w-7 text-purple-600" />
										<div className="my-1 flex flex-col items-end">
											<label className="text-lg font-semibold leading-5 text-gray-800">Cột cuối :</label>
											<label className="text-xs font-semibold text-gray-600">(1-120)</label>
										</div>
										<input
											title={errors.column ? errors.column.message : '1 to 120'}
											type="number"
											min="1"
											max="120"
											maxLength="3"
											required
											className={`w-28 rounded-lg px-4 py-2 text-2xl font-semibold shadow-md transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
												errors.column && 'border-2 border-red-500'
											}`}
											{...register('column', { required: true })}
										/>
									</div>
								</div>
								<div className="flex grow md:grow-0">
									<div className="flex flex-col items-center justify-center gap-2 rounded-l-lg bg-gradient-to-br from-purple-900 to-pink-800 p-3 text-white shadow-md">
										<label className="text-sm font-semibold leading-3">Số thứ tự</label>
										<label className="text-2xl font-semibold leading-5">
											{cinemas[selectedCinemaIndex].theaters.length + 1}
										</label>
									</div>
									<button
										title="Add theater"
										disabled={isIncreasing}
										className="flex grow items-center justify-center whitespace-nowrap rounded-r-lg bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95 disabled:from-slate-500 disabled:to-slate-400 md:grow-0"
										type="submit"
									>
										{isIncreasing ? 'Đang xử lý...' : 'THÊM +'}
									</button>
								</div>
							</div>
						</div>
					)}
				</form>
				{cinemas[selectedCinemaIndex].theaters.map((theater, index) => {
					return (
						<Theater
							key={index}
							theaterId={theater._id}
							movies={movies}
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
						/>
					)
				})}
				{auth.role === 'admin' && cinemas[selectedCinemaIndex].theaters.length > 0 && (
					<div className="flex justify-center">
						<button
							title="Delete last theater"
							className="w-fit rounded-lg bg-gradient-to-r from-red-700 to-rose-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-rose-500 active:scale-95 disabled:from-slate-500 disabled:to-slate-400"
							onClick={() => handleDecreaseTheater()}
							disabled={isDecreasing}
						>
							{isDecreasing ? 'Đang xử lý...' : 'XÓA RẠP CUỐI CÙNG -'}
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default TheaterListsByCinema
