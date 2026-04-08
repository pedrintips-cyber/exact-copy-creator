import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

const PARADISE_API_URL = "https://multi.paradisepags.com/api/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const PARADISE_API_KEY = Deno.env.get("PARADISE_API_KEY");
    if (!PARADISE_API_KEY) {
      return new Response(JSON.stringify({ error: "PARADISE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transaction_id");

    if (!transactionId) {
      return new Response(JSON.stringify({ error: "transaction_id é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(
      `${PARADISE_API_URL}/query.php?action=get_transaction&id=${transactionId}`,
      {
        headers: {
          "X-API-Key": PARADISE_API_KEY,
        },
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify({
      status: data.status || "unknown",
      amount: data.amount,
      amountFormatted: data.amount_in_reais,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Check payment error:", error);
    return new Response(JSON.stringify({ error: "Erro ao consultar pagamento" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
