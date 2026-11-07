import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import React from "react";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import logo from "../assests/images/logo.png";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";

const forgotPasswordSchema = z.object({
	email: z.email(),
});

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [resend, setResend] = React.useState<boolean>(false);
	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onSubmit: forgotPasswordSchema,
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
						<h1 className="text-xl font-bold">Khôi phục mật khẩu</h1>
					</div>

					<form.Field name="email">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Email</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="email"
										placeholder="m@example.com"
										required
									/>

									<form.Subscribe
										selector={(state) => [state.canSubmit, state.isSubmitting]}
									>
										{([canSubmit, isSubmitting]) => (
											<InputGroupAddon align="inline-end">
												<Button
													variant="outline"
													size="sm"
													disabled={resend || canSubmit}
													className="text-xs"
												>
													{isSubmitting && <Spinner />}
													{resend ? "Gửi lại sau 50s" : "Gửi"}
												</Button>
											</InputGroupAddon>
										)}
									</form.Subscribe>
								</InputGroup>
								<FieldDescription>
									Nhập email để khôi phục mật khẩu sau đó bấm "Gửi"
								</FieldDescription>
							</Field>
						)}
					</form.Field>

					<Field>
						<Link to="/" className={buttonVariants({ variant: "default" })}>
							<ArrowLeftIcon /> Quay lại đăng nhập
						</Link>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
