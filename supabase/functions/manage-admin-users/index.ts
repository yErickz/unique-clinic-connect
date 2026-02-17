import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if caller is admin
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: caller.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Acesso negado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const method = req.method;
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // LIST admin users
    if (method === "GET" && action === "list") {
      const { data: roles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at")
        .eq("role", "admin");

      if (rolesErr) throw rolesErr;

      // Get user details from auth
      const users = [];
      for (const role of roles || []) {
        const { data: { user } } = await supabase.auth.admin.getUserById(role.user_id);
        if (user) {
          users.push({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            role_created_at: role.created_at,
            is_caller: user.id === caller.id,
          });
        }
      }

      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CREATE admin user
    if (method === "POST" && action === "create") {
      const { email, password } = await req.json();

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: "Email e senha são obrigatórios" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create the user
      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createErr) {
        return new Response(
          JSON.stringify({ error: createErr.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Assign admin role
      const { error: roleErr } = await supabase.from("user_roles").insert({
        user_id: newUser.user.id,
        role: "admin",
      });

      if (roleErr) {
        // Rollback: delete user if role assignment fails
        await supabase.auth.admin.deleteUser(newUser.user.id);
        throw roleErr;
      }

      return new Response(
        JSON.stringify({
          user: {
            id: newUser.user.id,
            email: newUser.user.email,
            created_at: newUser.user.created_at,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE admin user
    if (method === "DELETE" && action === "delete") {
      const { user_id } = await req.json();

      if (!user_id) {
        return new Response(
          JSON.stringify({ error: "user_id é obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (user_id === caller.id) {
        return new Response(
          JSON.stringify({ error: "Você não pode remover seu próprio acesso" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Remove role
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", user_id)
        .eq("role", "admin");

      // Delete user from auth
      await supabase.auth.admin.deleteUser(user_id);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Ação não encontrada" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
