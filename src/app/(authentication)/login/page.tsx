import { LoginForm } from "@/components/blocks/authentication/login-form"

export default async function LoginPage() {
	return (
		<div className="flex justify-center lg:justify-start h-screen">
			<LoginForm />
		</div>
	)
}
