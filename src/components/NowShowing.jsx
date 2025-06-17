import 'react-toastify/dist/ReactToastify.css'
import Loading from './Loading'

const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
	return (
		<div className="mx-4 flex flex-col rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 p-6 text-gray-900 shadow-xl sm:mx-8 sm:p-8">
			<h2 className="text-3xl font-bold tracking-tight text-gray-800">Phim Đang Chiếu</h2>
			{isFetchingMoviesDone ? (
				movies.length ? (
					<div className="mt-4 overflow-x-auto pb-4 sm:mt-6">
						<div className="mx-auto flex w-fit gap-6">
							{movies?.map((movie, index) => {
								return movies[selectedMovieIndex]?._id === movie._id ? (
									<div
										key={index}
										title={movie.name}
										className="group flex w-[120px] transform cursor-pointer flex-col rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 p-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 sm:w-[160px]"
										onClick={() => {
											setSelectedMovieIndex(null)
											sessionStorage.setItem('selectedMovieIndex', null)
										}}
									>
										<div className="relative overflow-hidden rounded-lg">
											<img
												src={movie.img}
												alt={movie.name}
												className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110 sm:h-52"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
										</div>
										<p className="truncate pt-2 text-center text-sm font-semibold leading-4 text-white">
											{movie.name}
										</p>
									</div>
								) : (
									<div
										key={index}
										className="group flex w-[120px] transform cursor-pointer flex-col rounded-xl bg-white p-2 shadow-md transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-400 hover:text-white active:scale-95 sm:w-[160px]"
										onClick={() => {
											setSelectedMovieIndex(index)
											sessionStorage.setItem('selectedMovieIndex', index)
										}}
									>
										<div className="relative overflow-hidden rounded-lg">
											<img
												src={movie.img}
												alt={movie.name}
												className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110 sm:h-52"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
										</div>
										<p className="truncate pt-2 text-center text-sm font-semibold leading-4 text-gray-800 group-hover:text-white">
											{movie.name}
										</p>
									</div>
								)
							})}
						</div>
					</div>
				) : (
					<div className="mt-6 rounded-xl bg-white p-6 text-center text-lg font-medium text-gray-600 shadow-lg">
						Không có phim nào đang chiếu
					</div>
				)
			) : (
				<Loading />
			)}
		</div>
	)
}

export default NowShowing
