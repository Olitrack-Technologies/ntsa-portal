/**
 * /login — Authentication entry point.
 * Mantine form handles validation; router redirects on success.
 */
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

// Simulated async login — swap for real API call
async function authenticate(
	username: string,
	password: string
): Promise<boolean> {
	await new Promise((r) => setTimeout(r, 800));
	return username === "ntsa" && password === "password";
}

// --- Component --------------------------------------------------------------

export default function LoginPage() {
	const router = useRouter();

	const form = useForm({
		initialValues: { username: "", password: "" },
		validate: {
			username: (v) => (v.trim().length < 2 ? "Username is required" : null),
			password: (v) => (v.length < 4 ? "Password is required" : null)
		}
	});

	async function handleSubmit(values: { username: string; password: string }) {
		const ok = await authenticate(values.username, values.password);
		if (ok) {
			router.push("/");
		} else {
			form.setErrors({ password: "Invalid username or password" });
		}
	}

	return (
		<>
			<Head>
				<title>Sign In — NTSA Portal</title>
			</Head>

			<div className="min-h-screen flex">
				{/* ── Left brand panel ─────────────────────────────────────── */}
				<div className="hidden lg:flex flex-col justify-between w-[52%] bg-[#0f172a] px-14 py-12 relative overflow-hidden">
					{/* Decorative circles */}
					<div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-500/10" />
					<div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full bg-teal-400/5 translate-x-1/3 translate-y-1/3" />
					<div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-indigo-500/10 -translate-x-1/2 -translate-y-1/2" />

					{/* Logo */}

					<div />

					{/* Centre copy */}
					<div className="relative z-10 flex flex-col gap-5 mt-12">
						<div className="flex items-center gap-2 mb-2">
							<span className="w-8 h-[2px] bg-teal-400" />
							<span className="text-teal-400 text-xs font-semibold uppercase tracking-widest">
								Fleet Intelligence & Monitoring
							</span>
						</div>
						<h1 className="text-white text-4xl font-bold leading-snug">
							Real-time vehicle tracking and compliance monitoring.
						</h1>
						<p className="text-slate-400 text-sm leading-relaxed max-w-xs">
							Monitor compliance, track fleet movement, and access owner records
							— all in one secure portal.
						</p>
					</div>

					{/* Footer note */}
					<p className="relative z-10 text-slate-600 text-[11px]">
						© {new Date().getFullYear()}. Scantech Technologies
					</p>
				</div>

				{/* ── Right form panel ─────────────────────────────────────── */}
				<div className="flex flex-1 flex-col items-center justify-center  px-8 py-12">
					{/* Mobile logo */}
					<div className="mb-8 ">
						<Image
							src="/logo.png"
							alt="Small World"
							width={120}
							height={48}
							className="object-contain"
						/>
					</div>

					<div className="w-full max-w-sm flex flex-col gap-8">
						{/* Heading */}
						<div className="flex flex-col gap-1">
							<h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
							<p className="text-sm text-gray-500">
								Sign in to the NTSA portal
							</p>
						</div>

						{/* Form */}
						<form
							onSubmit={form.onSubmit(handleSubmit)}
							className="flex flex-col gap-4">
							<TextInput
								label="Username"
								placeholder="Enter your username"
								variant="filled"
								size="sm"
								styles={{
									label: { fontSize: 12, fontWeight: 600, marginBottom: 4 },
									input: { borderRadius: 8 }
								}}
								{...form.getInputProps("username")}
							/>

							<PasswordInput
								label="Password"
								placeholder="Enter your password"
								variant="filled"
								size="sm"
								styles={{
									label: { fontSize: 12, fontWeight: 600, marginBottom: 4 },
									input: { borderRadius: 8 }
								}}
								{...form.getInputProps("password")}
							/>

							<Button
								type="submit"
								fullWidth
								size="sm"
								color="teal"
								loading={form.submitting}
								className="mt-2"
								styles={{ root: { borderRadius: 8, height: 40 } }}>
								Sign in
							</Button>
						</form>

						<p className="text-center text-[11px] text-gray-400">
							Having trouble?{" "}
							<span className="text-teal-600 font-medium cursor-pointer hover:underline">
								Contact support
							</span>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

// Redirect already-authenticated users away from the login page
export const getServerSideProps: GetServerSideProps = async () => {
	return { props: {} };
};
