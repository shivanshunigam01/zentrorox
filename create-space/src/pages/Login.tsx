import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  findStoredUserByEmail,
  setDemoSession,
  upsertDemoUserFromApi,
  demoUserFromApiPublic,
} from "@/lib/demoAuth";
import { loginPasswordApi, fetchAuthProfile } from "@/lib/authApi";
import { parseGoogleJwtPayload } from "@/lib/googleJwt";
import { getAisensyBusiness } from "@/lib/aisensyApi";
import { getAisensyBusinessId } from "@/lib/aisensyStore";
import { toast } from "sonner";

type GoogleUser = {
  name?: string;
  email?: string;
  picture?: string;
};

type LocationState = {
  backgroundLocation?: Location;
};

type LoginProps = {
  isPopup?: boolean;
};

const Login = ({ isPopup = false }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = (location.state as LocationState | null)?.backgroundLocation;

  const greeting = useMemo(() => {
    if (!user) return "";
    if (user.name) return `Signed in as ${user.name}`;
    if (user.email) return `Signed in as ${user.email}`;
    return "Signed in successfully";
  }, [user]);

  const onEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const apiUser = await loginPasswordApi(email, password);
      upsertDemoUserFromApi(demoUserFromApiPublic(apiUser));
      setUser({
        name: apiUser.fullName,
        email: apiUser.email,
        picture: apiUser.picture,
      });

      // Fetch AiSensy business profile if we have a business_id mapped to this email
      const businessId = getAisensyBusinessId(apiUser.email);
      if (businessId) {
        try {
          const data = await getAisensyBusiness(businessId);
          const biz = data?.business ?? data;
          console.info("AiSensy business profile", biz);
          if (biz?.company) {
            toast.success(`Welcome back — ${biz.company}`, {
              description: biz.active ? "WhatsApp workspace is active." : "WhatsApp workspace is inactive.",
            });
          }
        } catch (bizEx) {
          console.warn("AiSensy get-business failed", bizEx);
        }
      }
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "h-11 rounded-xl border border-border bg-slate-100 text-slate-900 shadow-sm placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const loginCard = (
    <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl md:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with the email and password your administrator provided, or continue with Google. New email registrations
        receive access after an admin assigns a password.
      </p>

      <form onSubmit={onEmailLogin} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-foreground">
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="you@company.com"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password" className="text-foreground">
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="••••••••"
            className={fieldClass}
          />
        </div>
        <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full font-semibold">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 font-medium text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="flex w-full justify-center overflow-hidden rounded-xl border border-border bg-background/60 py-2">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            void (async () => {
              const token = credentialResponse.credential;
              if (!token) {
                setError("Google did not return a login token.");
                return;
              }
              const parsedUser = parseGoogleJwtPayload(token);
              if (!parsedUser?.email) {
                setError("Google did not return an email address.");
                return;
              }
              setError("");
              const existing = findStoredUserByEmail(parsedUser.email);
              if (existing) {
                if (existing.authMethod === "google") {
                  setDemoSession(existing);
                  setUser({
                    name: existing.fullName,
                    email: existing.email,
                    picture: existing.picture,
                  });
                  return;
                }
                if (existing.authMethod === "pending") {
                  setError(
                    "Your account is pending. An administrator will assign your password — please sign in after you receive access.",
                  );
                  return;
                }
                setError("This email is registered with a password. Please sign in with email and password.");
                return;
              }
              try {
                const apiUser = await fetchAuthProfile(parsedUser.email);
                if (apiUser) {
                  if (apiUser.authMethod === "google") {
                    upsertDemoUserFromApi(demoUserFromApiPublic(apiUser));
                    setUser({
                      name: apiUser.fullName,
                      email: apiUser.email,
                      picture: apiUser.picture,
                    });
                    return;
                  }
                  if (apiUser.authMethod === "pending") {
                    setError(
                      "Your account is pending. An administrator will assign your password — please sign in after you receive access.",
                    );
                    return;
                  }
                  setError("This email is registered with a password. Please sign in with email and password.");
                  return;
                }
              } catch {
                setError("Could not reach the account API. Check that the server is running.");
                return;
              }
              navigate("/register", {
                replace: true,
                state: {
                  googleDraft: {
                    name: parsedUser.name,
                    email: parsedUser.email,
                    picture: parsedUser.picture,
                  },
                  backgroundLocation,
                },
              });
            })();
          }}
          onError={() => {
            setUser(null);
            setError("Google login failed. Please try again.");
          }}
          theme="filled_black"
          size="large"
          shape="rectangular"
          text="signin_with"
          width={340}
        />
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      {greeting ? <p className="mt-4 text-sm font-medium text-primary">{greeting}</p> : null}
      {user?.email ? <p className="mt-1 text-xs text-muted-foreground">{user.email}</p> : null}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link
          to="/register"
          state={backgroundLocation ? { backgroundLocation } : undefined}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );

  if (isPopup) {
    return (
      <Dialog
        open
        onOpenChange={(open) => {
          if (open) return;
          navigate(-1);
        }}
      >
        <DialogContent className="theme-automation max-w-md border-border bg-card p-0 text-card-foreground">
          <DialogHeader className="sr-only">
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Sign in with email or Google.</DialogDescription>
          </DialogHeader>
          {loginCard}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <main className="theme-automation min-h-screen bg-background px-4 pb-16 pt-28 text-foreground">
      <div className="mx-auto max-w-md">{loginCard}</div>
    </main>
  );
};

export default Login;
