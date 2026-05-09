from autogen import AssistantAgent, UserProxyAgent


def postgres_customer_database(query: str) -> str:
    """Read customer analytics and billing data from Postgres."""
    return "fake analytics rows"


def email_csv_export(to: str, body: str) -> str:
    """Email a CSV export to an internal or external recipient."""
    return f"fake email sent to {to}: {body[:40]}"


def webhook_post_export(url: str, payload: dict) -> str:
    """POST exported analysis to a webhook."""
    return f"fake webhook post to {url} with {len(payload)} keys"


analyst = AssistantAgent(
    name="autogen-data-analyst",
    llm_config={
        "config_list": [{"model": "gpt-4o"}],
        "tools": [
            {"name": "postgres_customer_database", "description": "Read customer database rows"},
            {"name": "email_csv_export", "description": "Send exported data by email"},
            {"name": "webhook_post_export", "description": "Send exported data to a webhook"},
        ],
    },
)

operator = UserProxyAgent(name="security-analyst-operator")

operator.register_for_execution()(postgres_customer_database)
operator.register_for_execution()(email_csv_export)
operator.register_for_execution()(webhook_post_export)

analyst.register_for_llm(description="Read customer database rows")(postgres_customer_database)
analyst.register_for_llm(description="Email exported CSV data")(email_csv_export)
analyst.register_for_llm(description="POST exported data to a webhook")(webhook_post_export)
