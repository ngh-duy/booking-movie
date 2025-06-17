import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
	const navigate = useNavigate()
	const { auth, setAuth } = useContext(AuthContext)
	const [errorsMessage, setErrorsMessage] = useState('')
	const [isLoggingIn, SetLoggingIn] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const onSubmit = async (data) => {
		SetLoggingIn(true)
		try {
			const response = await axios.post('/auth/login', data)
			// console.log(response.data)
			toast.success('Login successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			setAuth((prev) => ({ ...prev, token: response.data.token }))
			navigate('/')
		} catch (error) {
			console.error(error.response.data)
			setErrorsMessage(error.response.data)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetLoggingIn(false)
		}
	}

	const inputClasses = () => {
		return 'appearance-none rounded-lg block w-full px-4 py-3 border-2 border-gray-200 placeholder-gray-400 text-gray-800 text-lg shadow-sm transition-all duration-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50'
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-pink-800 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
				<div>
					<h2 className="mt-4 text-center text-4xl font-extrabold tracking-tight text-gray-900">Đăng nhập</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<input
						name="username"
						type="text"
						autoComplete="username"
						{...register('username', { required: true })}
						className={inputClasses`${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
						placeholder="Tên đăng nhập"
					/>
					{errors.username && <span className="text-sm font-medium text-red-500">Vui lòng nhập tên đăng nhập</span>}
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						{...register('password', { required: true })}
						className={inputClasses`${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
						placeholder="Mật khẩu"
					/>
					{errors.password && <span className="text-sm font-medium text-red-500">Vui lòng nhập mật khẩu</span>}

					<div>
						{errorsMessage && <span className="text-sm font-medium text-red-500">{errorsMessage}</span>}
						<button
							type="submit"
							className="mt-4 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 py-3 px-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95 disabled:from-slate-500 disabled:to-slate-400"
							disabled={isLoggingIn}
						>
							{isLoggingIn ? 'Đang xử lý...' : 'Đăng nhập'}
						</button>
					</div>
					<p className="text-right text-gray-600">
						Chưa có tài khoản?{' '}
						<Link to={'/register'} className="font-bold text-purple-600 hover:text-purple-500 transition-colors duration-300">
							Đăng ký ngay
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
