import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-tailwindcss-select'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CinemaLists from '../components/CinemaLists'
import DateSelector from '../components/DateSelector'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ScheduleTable from '../components/ScheduleTable'
import { AuthContext } from '../context/AuthContext'

const Schedule = () => {
	const { auth } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors }
	} = useForm()
	const [selectedDate, setSelectedDate] = useState(
		(sessionStorage.getItem('selectedDate') && new Date(sessionStorage.getItem('selectedDate'))) || new Date()
	)
	const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
		parseInt(sessionStorage.getItem('selectedCinemaIndex')) || 0
	)
	const [cinemas, setCinemas] = useState([])
	const [isFetchingCinemas, setIsFetchingCinemas] = useState(true)
	const [movies, setMovies] = useState()
	const [isAddingShowtime, SetIsAddingShowtime] = useState(false)
	const [selectedMovie, setSelectedMovie] = useState(null)

	const fetchCinemas = async (data) => {
		try {
			setIsFetchingCinemas(true)
			let response
			if (auth.role === 'admin') {
				response = await axios.get('/cinema/unreleased', {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get('/cinema')
			}
			// console.log(response.data.data)
			setCinemas(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingCinemas(false)
		}
	}

	useEffect(() => {
		fetchCinemas()
	}, [])

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
		setValue('autoIncrease', true)
		setValue('rounding5', true)
		setValue('gap', '00:10')
	}, [])

	const onAddShowtime = async (data) => {
		try {
			SetIsAddingShowtime(true)
			if (!data.movie) {
				toast.error('Please select a movie', {
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
				{ movie: data.movie, showtime, theater: data.theater, repeat: data.repeat, isRelease: data.isRelease },
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			// console.log(response.data)
			fetchCinemas()
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
			toast.success('Add showtime successful!', {
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
			SetIsAddingShowtime(false)
		}
	}

	const props = {
		cinemas,
		selectedCinemaIndex,
		setSelectedCinemaIndex,
		fetchCinemas,
		auth,
		isFetchingCinemas
	}

	return (
		<div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-purple-900 to-pink-800 pb-12 text-gray-900 sm:gap-10">
			<Navbar />
			<CinemaLists {...props} />
			{selectedCinemaIndex !== null &&
				(cinemas[selectedCinemaIndex]?.theaters?.length ? (
					<div className="mx-4 flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-100 p-6 shadow-xl sm:mx-8 sm:gap-6 sm:p-8">
						<h2 className="text-3xl font-bold tracking-tight text-gray-800">Lịch chiếu</h2>
						<DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
						{auth.role === 'admin' && (
							<form
								className="flex flex-col gap-6 rounded-xl bg-gradient-to-br from-purple-100 to-white p-6 shadow-lg lg:flex-row"
								onSubmit={handleSubmit(onAddShowtime)}
							>
								<div className="flex grow flex-col gap-4 rounded-lg">
									<div className="flex flex-col gap-4 rounded-lg lg:flex-row lg:items-stretch">
										<div className="flex grow items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start">
											<label className="whitespace-nowrap text-lg font-semibold leading-5 text-gray-800">
												Rạp chiếu:
											</label>
											<select
												className="h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-lg font-medium text-gray-800 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
												required
												{...register('theater', { required: true })}
											>
												<option value="" defaultValue>
													Chọn rạp chiếu
												</option>
												{cinemas[selectedCinemaIndex].theaters?.map((theater, index) => {
													return (
														<option key={index} value={theater._id}>
															{theater.number}
														</option>
													)
												})}
											</select>
										</div>
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
														'flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-lg font-medium text-gray-800 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50'
												}}
											/>
										</div>
										<div className="flex items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start">
											<label className="whitespace-nowrap text-lg font-semibold leading-5 text-gray-800">
												Giờ chiếu:
											</label>
											<input
												type="time"
												className="h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-lg font-medium text-gray-800 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
												required
												{...register('showtime', { required: true })}
											/>
										</div>
									</div>
									<div className="flex flex-col gap-4 rounded-lg lg:flex-row lg:items-stretch">
										<div className="flex items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start">
											<label className="whitespace-nowrap text-lg font-semibold leading-5 text-gray-800">
												Lặp lại (Ngày):
											</label>
											<input
												type="number"
												min={1}
												defaultValue={1}
												max={31}
												className="h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-lg font-medium text-gray-800 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
												required
												{...register('repeat', { required: true })}
											/>
										</div>
										<label className="flex items-center gap-x-3 gap-y-2 whitespace-nowrap text-lg font-semibold leading-5 text-gray-800 lg:flex-col lg:items-start">
											Phát hành ngay:
											<input
												type="checkbox"
												className="h-6 w-6 rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 lg:h-8 lg:w-8"
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
													className="h-6 w-6 rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 lg:h-8 lg:w-8"
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
													className="h-6 w-6 rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 lg:h-8 lg:w-8"
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
												className="h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-lg font-medium text-gray-800 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 disabled:bg-gray-200"
												disabled={!watch('autoIncrease')}
												{...register('gap')}
											/>
										</div>
										<div className="flex flex-col items-start gap-3 lg:flex-row lg:items-end">
											<p className="font-semibold text-right text-gray-800 underline">Làm tròn</p>
											<label
												className="flex items-center gap-x-3 gap-y-2 whitespace-nowrap font-semibold leading-5 text-gray-800 lg:flex-col lg:items-start"
												title="Làm tròn đến phút gần nhất chia hết cho 5"
											>
												5 phút:
												<input
													type="checkbox"
													className="h-6 w-6 rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 lg:h-8 lg:w-8"
													disabled={!watch('autoIncrease')}
													{...register('rounding5', {
														onChange: () => setValue('rounding10', false)
													})}
												/>
											</label>
											<label
												className="flex items-center gap-x-3 gap-y-2 whitespace-nowrap font-semibold leading-5 text-gray-800 lg:flex-col lg:items-start"
												title="Làm tròn đến phút gần nhất chia hết cho 10"
											>
												10 phút:
												<input
													type="checkbox"
													className="h-6 w-6 rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 lg:h-8 lg:w-8"
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
									className="whitespace-nowrap rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95 disabled:from-slate-500 disabled:to-slate-400"
									type="submit"
								>
									THÊM +
								</button>
							</form>
						)}
						{isFetchingCinemas ? (
							<Loading />
						) : (
							<div>
								<h2 className="text-2xl font-bold tracking-tight text-gray-800">Danh sách rạp</h2>
								{cinemas[selectedCinemaIndex]?._id && (
									<ScheduleTable
										cinema={cinemas[selectedCinemaIndex]}
										selectedDate={selectedDate}
										auth={auth}
									/>
								)}
							</div>
						)}
					</div>
				) : (
					<div className="mx-4 flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-100 p-6 shadow-xl sm:mx-8 sm:gap-6 sm:p-8">
						<p className="text-center text-lg font-medium text-gray-600">Không có rạp chiếu nào</p>
					</div>
				))}
		</div>
	)
}

export default Schedule
