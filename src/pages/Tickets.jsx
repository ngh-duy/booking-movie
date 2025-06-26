import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const Tickets = () => {
	const { auth } = useContext(AuthContext)
	const [tickets, setTickets] = useState([])
	const [isFetchingticketsDone, setIsFetchingticketsDone] = useState(false)
	const fetchTickets = async () => {
		try {
			setIsFetchingticketsDone(false)
			const response = await axios.get('/auth/tickets', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			setTickets(
				response.data.data.tickets?.sort((a, b) => {
					if (a.showtime.showtime > b.showtime.showtime) {
						return 1
					}
					return -1
				})
			)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingticketsDone(true)
		}
	}

	useEffect(() => {
		fetchTickets()
	}, [])

	return (
		<div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-purple-900 to-pink-800 pb-12 text-gray-900 sm:gap-10">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-6 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-100 p-6 shadow-xl sm:mx-8 sm:p-8">
				<h2 className="text-3xl font-bold tracking-tight text-gray-800">Vé của tôi</h2>
				{isFetchingticketsDone ? (
					<>
						{(() => {
							const now = new Date();
							let futureTickets = tickets.filter(ticket => {
								const showtime = ticket.showtime?.showtime;
								if (!showtime) return false;
								return new Date(showtime) > now;
							});
							futureTickets = futureTickets.sort((a, b) => new Date(a.showtime.showtime) - new Date(b.showtime.showtime));
							if (futureTickets.length === 0) {
								return <p className="text-center text-lg text-gray-700">Bạn chưa có vé nào cho các suất phim sắp chiếu</p>;
							}
							return (
								<div className="grid grid-cols-1 gap-6 xl:grid-cols-2 min-[1920px]:grid-cols-3">
									{futureTickets.map((ticket, index) => (
										<div className="flex flex-col transition-all duration-300 hover:scale-[1.02]" key={index}>
											<ShowtimeDetails showtime={ticket.showtime} />
											<div className="flex h-full flex-col justify-between rounded-b-xl bg-gradient-to-br from-purple-100 to-white text-center text-lg shadow-lg md:flex-row">
												<div className="flex h-full flex-col items-center gap-x-4 px-6 py-3 md:flex-row">
													<p className="whitespace-nowrap font-semibold text-gray-800">Ghế: </p>
													<p className="text-left text-gray-700">
														{ticket.seats.map((seat) => seat.row + seat.number).join(', ')}
													</p>
													<p className="whitespace-nowrap text-gray-600">({ticket.seats.length} ghế)</p>
												</div>
											</div>
										</div>
									))}
								</div>
							);
						})()}
					</>
				) : (
					<Loading />
				)}
			</div>
		</div>
	)
}

export default Tickets
