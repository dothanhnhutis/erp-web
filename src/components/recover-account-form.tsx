import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import logo from "../assests/images/logo.png";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";

const recoverSchema = z
	.object({
		password: z
			.string()
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/,
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords don't match",
		path: ["confirmPassword"], // path of error
	});

export function RecoverAccountForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const form = useForm({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: recoverSchema,
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			console.log(value);
		},
	});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<img src={logo} alt="logo" className="aspect-square w-40" />
						<h1 className="text-xl font-bold">Khôi phục tài khoản</h1>
						<p className="text-sm text-muted-foreground text-balance">
							Nhập mật khẩu và xác nhận mật khẩu để đặt lại mật khẩu.
						</p>
					</div>

					<form.Field name="password">
						{(field) => {
							return (
								<Field>
									<FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
									<InputGroup>
										<InputGroupInput
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type={showPassword ? "password" : "text"}
											placeholder="*************"
										/>
										<InputGroupAddon align="inline-end">
											<Button
												variant="ghost"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? <EyeOffIcon /> : <EyeIcon />}
											</Button>
										</InputGroupAddon>
									</InputGroup>
									<div className="text-left text-sm leading-normal font-normal text-muted-foreground">
										<p className="text-primary">Mật khẩu phải bao gồm:</p>
										<ul className="list-decimal list-inside">
											<li className="text-destructive">
												Mật khẩu có ít nhất 8 ký tự.
											</li>
											<li className="text-green-600">
												Mật khẩu phải có chữa hoa, thường và số.
											</li>
											<li>Mật khẩu phải gồm có ít nhất 1 ký tự đặt biệt</li>
										</ul>
									</div>
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="confirmPassword">
						{(field) => {
							return (
								<Field>
									<FieldLabel htmlFor={field.name}>
										Xác nhận mật khẩu
									</FieldLabel>
									<InputGroup>
										<InputGroupInput
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type={showPassword ? "password" : "text"}
											placeholder="*************"
										/>
										<InputGroupAddon align="inline-end">
											<Button
												variant="ghost"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? <EyeOffIcon /> : <EyeIcon />}
											</Button>
										</InputGroupAddon>
									</InputGroup>
									<FieldError>
										Xác nhận mật khẩu không giống với mật khẩu.
									</FieldError>
								</Field>
							);
						}}
					</form.Field>

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Field>
								<Button type="submit" disabled={!canSubmit}>
									{isSubmitting && <Spinner />}
									Khôi phục
								</Button>
							</Field>
						)}
					</form.Subscribe>
				</FieldGroup>
			</form>
		</div>
	);
}
