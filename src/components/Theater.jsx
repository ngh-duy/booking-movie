import { ArrowsRightLeftIcon, ArrowsUpDownIcon, InformationCircleIcon, UserIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-tailwindcss-select'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import Loading from './Loading'
import Showtimes from './Showtimes'

const Theater = ({ theaterId, movies, selectedDate, filterMovie, setSelectedDate }) => {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		getValues,
		watch,
		formState: { errors }
	} = useForm()

	const { auth } = useContext(AuthContext)

	const [theater, setTheater] = useState({})
	const [isFetchingTheaterDone, setIsFetchingTheaterDone] = useState(false)
	const [isAddingShowtime, SetIsAddingShowtime] = useState(false)
	const [selectedMovie, setSelectedMovie] = useState(null)

	const fetchTheater = async (data) => {
		try {
			setIsFetchingTheaterDone(false)
			let response
			if (auth.role === 'admin') {
				response = await axios.get(`/theater/unreleased/${theaterId}`, {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get(`/theater/${theaterId}`)
			}
			setTheater(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingTheaterDone(true)
		}
	}

	useEffect(() => {
		fetchTheater()
	}, [theaterId])

	useEffect(() => {
		setValue('autoIncrease', true)
		setValue('rounding5', true)
		setValue('gap', '00:10')
	}, [])

	const onAddShowtime = async (data) => {
		try {
			SetIsAddingShowtime(true)
			if (!data.movie) {
				toast.error('Vui lòng chọn phim', {
					position: 'top-center',
					autoClose: 2000,
					pauseOnHover: false
				})
				return
			}
			let showtime = new Date(selectedDate)
			const [hours, minutes] = data.showtime.split(':')
			showtime.setHours(hours, minutes, 0)
			const response = await axios.post(
				'/showtime',
				{ movie: data.movie, showtime, theater: theater._id, repeat: data.repeat, isRelease: data.isRelease },
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			fetchTheater()
			if (data.autoIncrease) {
				const movieLength = movies.find((movie) => movie._id === data.movie).length
				const [GapHours, GapMinutes] = data.gap.split(':').map(Number)
				const nextShowtime = new Date(showtime.getTime() + (movieLength + GapHours * 60 + GapMinutes) * 60000)
				if (data.rounding5 || data.rounding10) {
					const totalMinutes = nextShowtime.getHours() * 60 + nextShowtime.getMinutes()
					const roundedMinutes = data.rounding5
						? Math.ceil(totalMinutes / 5) * 5
						: Math.ceil(totalMinutes / 10) * 10
					let roundedHours = Math.floor(roundedMinutes / 60)
					const remainderMinutes = roundedMinutes % 60
					if (roundedHours === 24) {
						nextShowtime.setDate(nextShowtime.getDate() + 1)
						roundedHours = 0
					}
					setValue(
						'showtime',
						`${String(roundedHours).padStart(2, '0')}:${String(remainderMinutes).padStart(2, '0')}`
					)
				} else {
					setValue(
						'showtime',
						`${String(nextShowtime.getHours()).padStart(2, '0')}:${String(
							nextShowtime.getMinutes()
						).padStart(2, '0')}`
					)
				}
				if (data.autoIncreaseDate) {
					setSelectedDate(nextShowtime)
					sessionStorage.setItem('selectedDate', nextShowtime)
				}
			}
			toast.success('Thêm suất chiếu thành công!', {
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
			SetIsAddingShowtime(false)
		}
	}

	function rowToNumber(column) {
		let result = 0
		for (let i = 0; i < column.length; i++) {
			const charCode = column.charCodeAt(i) - 64
			result = result * 26 + charCode
		}
		return result
	}

	if (!isFetchingTheaterDone) {
		return <Loading />
	}

	return (
		<div className="flex flex-col">
			<div className="flex md:justify-between">
				<h3
					className={`flex w-fit items-center rounded-tl-2xl bg-gradient-to-br from-gray-800 to-gray-700 px-8 py-2 text-2xl font-bold text-white shadow-lg md:rounded-t-2xl md:px-10 ${
						auth.role !== 'admin' && 'rounded-t-2xl'
					}`}
				>
					{theater.number}
				</h3>
				{auth.role === 'admin' && (
					<div className="flex w-fit flex-col gap-x-3 rounded-tr-2xl bg-gradient-to-br from-purple-800 to-pink-700 px-6 py-2 font-semibold text-white shadow-lg md:flex-row md:gap-x-6 md:rounded-t-2xl md:text-lg md:font-bold">
						<div className="flex items-center gap-2">
							<ArrowsUpDownIcon className="h-5 w-5" />
							{theater?.seatPlan?.row === 'A' ? (
								<h4>Hàng: A</h4>
							) : (
								<h4>Hàng: A - {theater?.seatPlan?.row}</h4>
							)}
						</div>
						<div className="flex items-center gap-2">
							<ArrowsRightLeftIcon className="h-5 w-5" />
							{theater?.seatPlan?.column === 1 ? (
								<h4>Cột: 1</h4>
							) : (
								<h4>Cột: 1 - {theater?.seatPlan?.column}</h4>
							)}
						</div>
						<div className="flex items-center gap-2">
							<UserIcon className="h-5 w-5" />
							{(rowToNumber(theater.seatPlan.row) * theater.seatPlan.column).toLocaleString('en-US')}{' '}
							Ghế
						</div>
					</div>
				)}
			</div>
			<div className="flex flex-col gap-6 rounded-b-2xl rounded-tr-2xl bg-gradient-to-br from-purple-50 to-white py-6 shadow-xl md:rounded-tr-none">
				{auth.role === 'admin' && (
					<>
						<form
							className="mx-6 flex flex-col gap-x-6 gap-y-4 lg:flex-row"
							onSubmit={handleSubmit(onAddShowtime)}
						>
							<div className="flex grow flex-col gap-4 rounded-xl">
								<div className="flex flex-col gap-4 rounded-xl lg:flex-row lg:items-stretch">
									<div className="flex grow-[2] items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start">
										<label className="whitespace-nowrap text-lg font-semibold leading-5 text-gray-800">
											Phim:
										</label>
										<Select
											value={selectedMovie}
											options={movies?.map((movie) => ({
												value: movie._id,
												label: movie.name
											}))}
											onChange={(value) => {
												setValue('movie', value.value)
												setSelectedMovie(value)
											}}
											isSearchable={true}
											primaryColor="purple"
											classNames={{
												menuButton: (value) =>
													'flex w-full font-semibold text-sm border border-gray-300 rounded-lg shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 focus:border-purple-500 focus:ring focus:ring-purple-500/20'
											}}
										/>
									</div>
									<div className="flex items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start">
										<label className="whitespace-nowrap text-lg font-semibold leading-5 text-gray-800">
											Giờ chiếu:
										</label>
										<input
											type="time"
											className="h-10 w-full rounded-lg bg-white px-3 py-2 font-semibold text-gray-900 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
											required
											{...register('showtime', { required: true })}
										/>
									</div>
								</div>
								<div className="flex flex-col gap-4 rounded-xl lg:flex-row lg:items-stretch">
									<div className="flex items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start">
										<label className="whitespace-nowrap text-lg font-semibold leading-5 text-gray-800">
											Lặp lại (Ngày):
										</label>
										<input
											type="number"
											min={1}
											defaultValue={1}
											max={31}
											className="h-10 w-full rounded-lg bg-white px-3 py-2 font-semibold text-gray-900 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
											required
											{...register('repeat', { required: true })}
										/>
									</div>
									<label className="flex items-center gap-x-3 gap-y-2 whitespace-nowrap text-lg font-semibold leading-5 text-gray-800 lg:flex-col lg:items-start">
										Phát hành ngay:
										<input
											type="checkbox"
											className="h-6 w-6 rounded-lg border-gray-300 text-purple-600 shadow-sm transition-all duration-300 focus:ring-purple-500/20 lg:h-8 lg:w-8"
											{...register('isRelease')}
										/>
									</label>
									<div className="flex flex-col items-start gap-3 lg:flex-row lg:items-end">
										<p className="font-semibold text-right text-gray-800 underline">Tự động tăng</p>
										<label
											className="flex items-center gap-x-3 gap-y-2 whitespace-nowrap font-semibold leading-5 text-gray-800 lg:flex-col lg:items-start"
											title="Sau khi thêm, cập nhật giờ chiếu thành thời gian kết thúc phim"
										>
											Giờ chiếu:
											<input
												type="checkbox"
												className="h-6 w-6 rounded-lg border-gray-300 text-purple-600 shadow-sm transition-all duration-300 focus:ring-purple-500/20 lg:h-8 lg:w-8"
												{...register('autoIncrease')}
											/>
										</label>
										<label
											className="flex items-center gap-x-3 gap-y-2 whitespace-nowrap font-semibold leading-5 text-gray-800 lg:flex-col lg:items-start"
											title="Sau khi thêm, cập nhật ngày thành thời gian kết thúc phim"
										>
											Ngày:
											<input
												type="checkbox"
												className="h-6 w-6 rounded-lg border-gray-300 text-purple-600 shadow-sm transition-all duration-300 focus:ring-purple-500/20 lg:h-8 lg:w-8"
												disabled={!watch('autoIncrease')}
												{...register('autoIncreaseDate')}
											/>
										</label>
									</div>
									<div
										className="flex items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start"
										title="Khoảng cách giữa các suất chiếu"
									>
										<label className="whitespace-nowrap font-semibold leading-5 text-gray-800">Khoảng cách:</label>
										<input
											type="time"
											className="h-10 w-full rounded-lg bg-white px-3 py-2 font-semibold text-gray-900 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-200"
											disabled={!watch('autoIncrease')}
											{...register('gap')}
										/>
									</div>
									<div className="flex flex-col items-start gap-3 lg:flex-row lg:items-end">
										<p className="font-semibold text-right text-gray-800 underline">Làm tròn</p>
										<label
											className="flex items-center gap-x-3 gap-y-2 whitespace-nowrap font-semibold leading-5 text-gray-800 lg:flex-col lg:items-start"
											title="Làm tròn đến 5 phút gần nhất"
										>
											5 phút:
											<input
												type="checkbox"
												className="h-6 w-6 rounded-lg border-gray-300 text-purple-600 shadow-sm transition-all duration-300 focus:ring-purple-500/20 lg:h-8 lg:w-8"
												disabled={!watch('autoIncrease')}
												{...register('rounding5', {
													onChange: () => setValue('rounding10', false)
												})}
											/>
										</label>
										<label
											className="flex items-center gap-x-3 gap-y-2 whitespace-nowrap font-semibold leading-5 text-gray-800 lg:flex-col lg:items-start"
											title="Làm tròn đến 10 phút gần nhất"
										>
											10 phút:
											<input
												type="checkbox"
												className="h-6 w-6 rounded-lg border-gray-300 text-purple-600 shadow-sm transition-all duration-300 focus:ring-purple-500/20 lg:h-8 lg:w-8"
												disabled={!watch('autoIncrease')}
												{...register('rounding10', {
													onChange: () => setValue('rounding5', false)
												})}
											/>
										</label>
									</div>
								</div>
							</div>
							<button
								title="Thêm suất chiếu"
								disabled={isAddingShowtime}
								className="transform whitespace-nowrap rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95 disabled:from-slate-500 disabled:to-slate-400"
								type="submit"
							>
								THÊM +
							</button>
						</form>
						{filterMovie?.name && (
							<div className="mx-6 flex gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white shadow-lg">
								<InformationCircleIcon className="h-6 w-6" />
								{`Bạn đang xem suất chiếu của "${filterMovie?.name}"`}
							</div>
						)}
					</>
				)}
				<Showtimes
					showtimes={theater.showtimes}
					movies={movies}
					selectedDate={selectedDate}
					filterMovie={filterMovie}
				/>
			</div>
		</div>
	)
}
export default Theater
