import { TrashIcon } from '@heroicons/react/24/solid'

const MovieLists = ({ movies, search, handleDelete }) => {
	const moviesList = movies?.filter((movie) => movie.name.toLowerCase().includes(search?.toLowerCase() || ''))

	return !!moviesList.length ? (
		<div className="grid grid-cols-1 gap-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 p-6 shadow-xl lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1920px]:grid-cols-5">
			{moviesList.map((movie, index) => {
				return (
					<div 
						key={index} 
						className="group flex min-w-fit transform flex-grow flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
					>
						<div className="relative overflow-hidden">
							<img 
								src={movie.img} 
								className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110 sm:h-52" 
								alt={movie.name}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						</div>
						<div className="flex flex-grow flex-col justify-between p-4">
							<div className="space-y-2">
								<p className="text-lg font-bold tracking-tight text-gray-800 sm:text-xl">{movie.name}</p>
								<p className="text-sm text-gray-600">
									<span className="font-medium">Thời lượng:</span> {movie.length || '-'} phút
								</p>
							</div>
							<button
								className="mt-4 flex w-fit transform items-center gap-2 self-end rounded-lg bg-gradient-to-br from-red-600 to-rose-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-rose-400 active:scale-95"
								onClick={() => handleDelete(movie)}
							>
								XÓA
								<TrashIcon className="h-5 w-5" />
							</button>
						</div>
					</div>
				)
			})}
		</div>
	) : (
		<div className="rounded-xl bg-white p-6 text-center text-lg font-medium text-gray-600 shadow-lg">
			Không tìm thấy phim
		</div>
	)
}

export default MovieLists
