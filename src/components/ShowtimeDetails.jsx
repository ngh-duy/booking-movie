import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'

const ShowtimeDetails = ({ showDeleteBtn, showtime, fetchShowtime }) => {
	const { auth } = useContext(AuthContext)
	const navigate = useNavigate()
	const [isDeletingShowtimes, SetIsDeletingShowtimes] = useState(false)
	const [isReleasingShowtime, setIsReleasingShowtime] = useState(false)
	const [isUnreleasingShowtime, setIsUnreleasingShowtime] = useState(false)

	const handleDelete = () => {
		const confirmed = window.confirm(`Bạn có muốn xóa suất chiếu này, bao gồm cả vé đã đặt?`)
		if (confirmed) {
			onDeleteShowtime()
		}
	}

	const onDeleteShowtime = async () => {
		try {
			SetIsDeletingShowtimes(true)
			const response = await axios.delete(`/showtime/${showtime._id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			navigate('/cinema')
			toast.success('Xóa suất chiếu thành công!', {
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
			SetIsDeletingShowtimes(false)
		}
	}

	const handleReleaseShowtime = () => {
		const confirmed = window.confirm(`Bạn có muốn phát hành suất chiếu này?`)
		if (confirmed) {
			onReleaseShowtime()
		}
	}

	const onReleaseShowtime = async () => {
		setIsReleasingShowtime(true)
		try {
			const response = await axios.put(
				`/showtime/${showtime._id}`,
				{ isRelease: true },
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			await fetchShowtime()
			toast.success(`Phát hành suất chiếu thành công!`, {
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
			setIsReleasingShowtime(false)
		}
	}

	const handleUnreleasedShowtime = () => {
		const confirmed = window.confirm(`Bạn có muốn hủy phát hành suất chiếu này?`)
		if (confirmed) {
			onUnreleasedShowtime()
		}
	}

	const onUnreleasedShowtime = async () => {
		setIsUnreleasingShowtime(true)
		try {
			const response = await axios.put(
				`/showtime/${showtime._id}`,
				{ isRelease: false },
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			await fetchShowtime()
			toast.success(`Hủy phát hành suất chiếu thành công!`, {
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
			setIsUnreleasingShowtime(false)
		}
	}

	return (
		<>
			{showDeleteBtn && auth.role === 'admin' && (
				<div className="mb-6 flex justify-end gap-3">
					{!showtime.isRelease && (
						<button
							title="Phát hành suất chiếu"
							className="flex w-fit transform items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95 disabled:from-slate-500 disabled:to-slate-400"
							onClick={() => handleReleaseShowtime(true)}
							disabled={isReleasingShowtime}
						>
							{isReleasingShowtime ? (
								'Đang xử lý...'
							) : (
								<>
									PHÁT HÀNH
									<EyeIcon className="h-5 w-5" />
								</>
							)}
						</button>
					)}
					{showtime.isRelease && (
						<button
							title="Hủy phát hành suất chiếu"
							className="flex w-fit transform items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95 disabled:from-slate-500 disabled:to-slate-400"
							onClick={() => handleUnreleasedShowtime(true)}
							disabled={isUnreleasingShowtime}
						>
							{isUnreleasingShowtime ? (
								'Đang xử lý...'
							) : (
								<>
									HỦY PHÁT HÀNH
									<EyeSlashIcon className="h-5 w-5" />
								</>
							)}
						</button>
					)}
					<button
						className="flex w-fit transform items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-rose-400 active:scale-95 disabled:from-slate-500 disabled:to-slate-400"
						onClick={() => handleDelete()}
						disabled={isDeletingShowtimes}
					>
						{isDeletingShowtimes ? (
							'Đang xử lý...'
						) : (
							<>
								XÓA
								<TrashIcon className="h-5 w-5" />
							</>
						)}
					</button>
				</div>
			)}
			<div className="flex justify-between">
				<div className="flex flex-col justify-center rounded-tl-2xl bg-gradient-to-br from-gray-800 to-gray-700 px-6 py-2 text-center font-bold text-white shadow-lg sm:px-10">
					<p className="text-sm tracking-wide">Phòng Chiếu</p>
					<p className="text-3xl tracking-tight">{showtime?.theater?.number}</p>
				</div>
				<div className="flex w-fit grow items-center justify-center rounded-tr-2xl bg-gradient-to-br from-purple-800 to-pink-700 px-6 py-2 text-center text-xl font-bold text-white shadow-lg sm:text-3xl">
					<p className="mx-auto tracking-tight">{showtime?.theater?.cinema.name}</p>
					{!showtime?.isRelease && <EyeSlashIcon className="h-8 w-8" title="Suất chiếu chưa phát hành" />}
				</div>
			</div>
			<div className="flex flex-col md:flex-row">
				<div className="flex grow flex-col gap-4 bg-gradient-to-br from-purple-50 to-white py-4 shadow-xl sm:py-6">
					<div className="flex items-center">
						<img src={showtime?.movie?.img} className="w-36 transform px-4 shadow-lg transition-all duration-300 hover:scale-105" />
						<div className="flex flex-col">
							<h4 className="mr-4 text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl md:text-3xl">
								{showtime?.movie?.name}
							</h4>
							{showtime?.movie && (
								<p className="mr-4 font-medium text-gray-600 sm:text-lg">
									Thời lượng: {showtime?.movie?.length || '-'} phút
								</p>
							)}
						</div>
					</div>
				</div>
				<div className="flex flex-col">
					<div className="flex h-full min-w-max flex-col items-center justify-center gap-y-2 bg-gradient-to-br from-purple-50 to-white py-4 text-center text-xl font-semibold shadow-xl sm:py-6 sm:text-2xl md:items-start">
						<p className="mx-4 text-lg leading-4 text-gray-700">
							{showtime?.showtime &&
								`${new Date(showtime?.showtime).toLocaleString('default', { weekday: 'long' })}`}
						</p>
						<p className="mx-4 text-gray-800">
							{showtime?.showtime &&
								`${new Date(showtime?.showtime).getDate()}
               					 ${new Date(showtime?.showtime).toLocaleString('default', { month: 'long' })}
                				${new Date(showtime?.showtime).getFullYear()}`}
						</p>
						<p className="mx-4 bg-gradient-to-r from-purple-800 to-pink-700 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
							{showtime?.showtime &&
								`${new Date(showtime?.showtime).getHours().toString().padStart(2, '0')} : ${new Date(
									showtime?.showtime
								)
									.getMinutes()
									.toString()
									.padStart(2, '0')}`}
						</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default ShowtimeDetails
