import { TicketIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const Purchase = () => {
	const navigate = useNavigate()
	const { auth } = useContext(AuthContext)
	const location = useLocation()
	const showtime = location.state.showtime
	const selectedSeats = location.state.selectedSeats || []
	const [isPurchasing, SetIsPurchasing] = useState(false)

	const onPurchase = async (data) => {
		SetIsPurchasing(true)
		try {
			const response = await axios.post(
				`/showtime/${showtime._id}`,
				{ seats: selectedSeats },
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			// console.log(response.data)
			navigate('/cinema')
			toast.success('Purchase seats successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error(error.response.data.message || 'Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsPurchasing(false)
		}
	}

	return (
		<div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-purple-900 to-pink-800 pb-12 sm:gap-10">
			<Navbar />
			<div className="mx-4 h-fit rounded-2xl bg-gradient-to-br from-purple-200 to-pink-100 p-6 shadow-xl sm:mx-8 sm:p-8">
				<ShowtimeDetails showtime={showtime} />
				<div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-purple-100 to-white text-center text-lg shadow-lg md:flex-row">
					<div className="flex flex-col items-center gap-x-6 px-6 py-4 md:flex-row">
						<p className="font-semibold text-gray-800">Ghế đã chọn : </p>
						<p className="text-start text-gray-700">{selectedSeats.join(', ')}</p>
						{!!selectedSeats.length && (
							<p className="whitespace-nowrap text-purple-600 font-medium">
								({selectedSeats.length} ghế)
							</p>
						)}
					</div>
					{!!selectedSeats.length && (
						<button
							onClick={() => onPurchase()}
							className="flex items-center justify-center gap-3 rounded-b-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95 disabled:from-slate-500 disabled:to-slate-400 md:rounded-none md:rounded-br-xl md:rounded-bl-xl"
							disabled={isPurchasing}
						>
							{isPurchasing ? (
								'Đang xử lý...'
							) : (
								<>
									<p>Xác nhận mua vé</p>
									<TicketIcon className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" />
								</>
							)}
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default Purchase
