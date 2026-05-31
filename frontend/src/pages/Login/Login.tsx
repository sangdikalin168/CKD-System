/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { FormEvent, useState } from "react";
import JWTManager from "../../utils/jwt";
import { useAuthContext } from "../../context/AuthContext";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useLoginMutation } from "../../generated/graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Login() {
  const { setIsAuthenticated } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [login] = useLoginMutation({
    onError: (err: any) => {
      setLoading(false);
      setError(err.message);
    },
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const { data } = await login({
      variables: { loginInput: { username, password } },
    });

    if (data?.login.success) {
      const res = data.login?.user;
      JWTManager.SetUserDetail(res?.display_name, res?.role, res?.user_id);
      JWTManager.setToken(data.login.accessToken as string);
      setIsAuthenticated(true);
    } else {
      if (data?.login.message) {
        setError(data.login.message);
        setLoading(false);
      }
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>ចូលប្រើប្រាស់ប្រព័ន្ធ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} autoComplete="off" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ឈ្មោះ ឬ លេខទូរស័ព្ទ</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">លេខសម្ងាត់</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="off"
              />
            </div>

            <Button type="submit" className="w-full">
              ចូល
            </Button>

            {_error && (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {_error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
