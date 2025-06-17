import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import MovieLists from '../components/MovieLists'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

const Movie = () => {
	const { auth } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const [movies, setMovies] = useState([])
	const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false)
	const [isAddingMovie, SetIsAddingMovie] = useState(false)

	const fetchMovies = async (data) => {
		try {
			setIsFetchingMoviesDone(false)
			const response = await axios.get('/movie')
			// console.log(response.data.data)
			reset()
			setMovies(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingMoviesDone(true)
		}
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	const onAddMovie = async (data) => {
		try {
			data.length = (parseInt(data.lengthHr) || 0) * 60 + (parseInt(data.lengthMin) || 0)
			SetIsAddingMovie(true)
			const response = await axios.post('/movie', data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchMovies()
			toast.success('Add movie successful!', {
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
			SetIsAddingMovie(false)
		}
	}

	const handleDelete = (movie) => {
		const confirmed = window.confirm(
			`Do you want to delete movie ${movie.name}, including its showtimes and tickets?`
		)
		if (confirmed) {
			onDeleteMovie(movie._id)
		}
	}

	const onDeleteMovie = async (id) => {
		try {
			const response = await axios.delete(`/movie/${id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchMovies()
			toast.success('Delete movie successful!', {
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

	const inputHr = parseInt(watch('lengthHr')) || 0
	const inputMin = parseInt(watch('lengthMin')) || 0
	const sumMin = inputHr * 60 + inputMin
	const hr = Math.floor(sumMin / 60)
	const min = sumMin % 60

	return (
		<div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-purple-900 to-pink-800 pb-12 text-gray-900 sm:gap-10">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-6 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-100 p-6 shadow-xl sm:mx-8 sm:p-8">
				<h2 className="text-3xl font-bold tracking-tight text-gray-800">Danh sách phim</h2>
				<form
					onSubmit={handleSubmit(onAddMovie)}
					className="flex flex-col items-stretch justify-end gap-x-6 gap-y-4 rounded-xl bg-gradient-to-br from-purple-100 to-white p-6 shadow-lg lg:flex-row"
				>
					<div className="flex w-full grow flex-col flex-wrap justify-start gap-6 lg:w-auto">
						<h3 className="text-2xl font-bold tracking-tight text-gray-800">Thêm phim mới</h3>
						<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
							<label className="text-lg font-semibold leading-5 text-gray-800">Tên phim :</label>
							<input
								type="text"
								required
								className="w-full flex-grow rounded-lg border-2 border-gray-200 px-4 py-2 text-lg font-medium shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 sm:w-auto"
								{...register('name', {
									required: true
								})}
							/>
						</div>
						<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
							<label className="text-lg font-semibold leading-5 text-gray-800">URL Poster :</label>
							<input
								type="text"
								required
								className="w-full flex-grow rounded-lg border-2 border-gray-200 px-4 py-2 text-lg font-medium shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 sm:w-auto"
								{...register('img', {
									required: true
								})}
							/>
						</div>
						<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
							<label className="text-lg font-semibold leading-5 text-gray-800">Thời lượng (giờ) :</label>
							<input
								type="number"
								min="0"
								max="20"
								maxLength="2"
								className="w-full flex-grow rounded-lg border-2 border-gray-200 px-4 py-2 text-lg font-medium shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 sm:w-auto"
								{...register('lengthHr')}
							/>
						</div>
						<div>
							<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
								<label className="text-lg font-semibold leading-5 text-gray-800">Thời lượng (phút) :</label>
								<input
									type="number"
									min="0"
									max="2000"
									maxLength="4"
									required
									className="w-full flex-grow rounded-lg border-2 border-gray-200 px-4 py-2 text-lg font-medium shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 sm:w-auto"
									{...register('lengthMin', {
										required: true
									})}
								/>
							</div>
							<div className="pt-2 text-right text-lg font-medium text-gray-600">{`${hr}h ${min}m / ${sumMin}m `}</div>
						</div>
					</div>
					<div className="flex w-full flex-col gap-6 lg:w-auto lg:flex-row">
						{watch('img') && (
							<img 
								src={watch('img')} 
								className="h-52 rounded-xl object-contain shadow-md transition-all duration-300 hover:scale-105 lg:h-72" 
								alt="Movie poster preview"
							/>
						)}
						<button
							className="w-full min-w-fit items-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-center text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95 disabled:from-slate-500 disabled:to-slate-400 lg:w-32 xl:w-40"
							type="submit"
							disabled={isAddingMovie}
						>
							{isAddingMovie ? 'Đang xử lý...' : 'THÊM +'}
						</button>
					</div>
				</form>
				<div className="relative">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
						<MagnifyingGlassIcon className="h-6 w-6 stroke-2 text-purple-600" />
					</div>
					<input
						type="search"
						className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-12 text-lg text-gray-800 shadow-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
						placeholder="Tìm kiếm phim"
						{...register('search')}
					/>
				</div>
				{isFetchingMoviesDone ? (
					<MovieLists movies={movies} search={watch('search')} handleDelete={handleDelete} />
				) : (
					<Loading />
				)}
			</div>
		</div>
	)
}

export default Movie
