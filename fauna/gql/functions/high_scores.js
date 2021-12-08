Update(
    Function("high_scores"), {
        body: Query(
            Lambda(
                ["size", "after", "before"],
                Let(
                    {
                        match: Match(Index("scores_by_time_elapsed_ms_desc")),
                        page: If(
                            Equals(Var("before"), null),
                            If(
                                Equals(Var("after"), null),
                                Paginate(Var("match"), {size: Var("size")}),
                                Paginate(Var("match"), {size: Var("size"), after: Var("after")})
                            ),
                            Paginate(Var("match"), {size: Var("size"), before: Var("before")}),
                        )
                    },
                    Map(Var("page"), Lambda(["timeElapsedMs", "person", "ref"], Get(Var("ref"))))
                )
            )
        )
    }
)
