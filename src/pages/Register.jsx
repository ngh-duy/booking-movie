import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
	const navigate = useNavigate()
	const [errorsMessage, setErrorsMessage] = useState('')
	const [isRegistering, SetIsRegistering] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const onSubmit = async (data) => {
		SetIsRegistering(true)
		try {
			const response = await axios.post('/auth/register', data)
			// console.log(response.data)
			toast.success('Registration successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
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
			SetIsRegistering(false)
		}
	}

	const inputClasses = () => {
		return 'appearance-none rounded-lg block w-full px-4 py-3 border-2 border-gray-200 placeholder-gray-400 text-lg text-gray-800 shadow-sm transition-all duration-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50'
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-pink-800 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
				<div>
					<h2 className="mt-4 text-center text-4xl font-extrabold tracking-tight text-gray-800">Đăng ký</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<input
						name="username"
						type="text"
						autoComplete="username"
						{...register('username', { 
							required: 'Vui lòng nhập tên đăng nhập',
							minLength: {
								value: 6,
								message: 'Tên đăng nhập phải có ít nhất 6 ký tự'
							},
							pattern: {
								value: /^[a-zA-Z0-9]+$/,
								message: 'Tên đăng nhập không được chứa ký tự đặc biệt'
							}
						})}
						className={inputClasses`${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
						placeholder="Tên đăng nhập"
					/>
					{errors.username && <span className="text-sm font-medium text-red-500">{errors.username?.message}</span>}
					<input
						name="email"
						type="email"
						autoComplete="email"
						{...register('email', { 
							required: 'Vui lòng nhập email',
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: 'Email không đúng định dạng'
							}
						})}
						className={inputClasses`${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
						placeholder="Email"
					/>
					{errors.email && <span className="text-sm font-medium text-red-500">{errors.email?.message}</span>}
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						{...register('password', {
							required: 'Vui lòng nhập mật khẩu',
							minLength: {
								value: 6,
								message: 'Mật khẩu phải có ít nhất 6 ký tự'
							}
						})}
						className={inputClasses`${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
						placeholder="Mật khẩu"
					/>
					{errors.password && <span className="text-sm font-medium text-red-500">{errors.password?.message}</span>}
					<div>
						{errorsMessage && <span className="text-sm font-medium text-red-500">{errorsMessage}</span>}
						<button
							type="submit"
							className="mt-4 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 py-3 px-6 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:from-slate-500 disabled:to-slate-400"
							disabled={isRegistering}
						>
							{isRegistering ? 'Đang xử lý...' : 'Đăng ký'}
						</button>
					</div>
					<p className="text-right text-gray-600">
						Đã có tài khoản?{' '}
						<Link to={'/login'} className="font-bold text-purple-600 hover:text-purple-500 transition-colors duration-300">
							Đăng nhập tại đây
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Register
