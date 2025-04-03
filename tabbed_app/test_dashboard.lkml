---
- dashboard: adoption
  title: Adoption
  layout: newspaper
  preferred_viewer: dashboards-next
  description: ''
  preferred_slug: ObZUKNoRJJDpaNLJYXT9U9
  elements:
  - name: ''
    type: text
    title_text: ''
    subtitle_text: ''
    body_text: '[{"type":"h1","children":[{"text":"Interaction Trends"}],"align":"center"},{"type":"p","children":[{"text":"How
      has overall use of Looker increased?"}],"id":"jb7eu","align":"center"}]'
    rich_content_json: '{"format":"slate"}'
    row: 0
    col: 0
    width: 20
    height: 2
  - name: " (Copy 2)"
    type: text
    title_text: " (Copy 2)"
    subtitle_text: ''
    body_text: '[{"type":"h1","children":[{"text":"Content Creation Trends"}],"align":"center"},{"type":"p","children":[{"text":"Is
      the collection of looks and dashboards increasing?"}],"id":"6j8cg","align":"center"}]'
    rich_content_json: '{"format":"slate"}'
    row: 20
    col: 0
    width: 24
    height: 2
  - title: Active Users
    name: Active Users
    model: system__activity
    explore: history
    type: looker_column
    fields: [days_ago, count_of_id]
    filters:
      from_bytecode: 'No'
    sorts: [days_ago desc]
    limit: 5000
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: diff_days(${history.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - category: dimension
      expression: |-
        case(when(diff_days(${history.created_time}, now()) < 31,"0-30 Days Ago"),
                when(diff_days(${history.created_time}, now())>30 AND diff_days(${history.created_time}, now())<61, "30-60 Days Ago"),
                when(diff_days(${history.created_time}, now())>60, "60-90 Days Ago"),
                "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - measure: count_of_id
      based_on: user.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    - category: dimension
      expression: contains(${user.email},"bytecode")
      label: From Bytecode?
      value_format:
      value_format_name:
      dimension: from_bytecode
      _kind_hint: dimension
      _type_hint: yesno
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: true
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: false, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    reference_lines: []
    show_dropoff: true
    defaults_version: 1
    hidden_pivots: {}
    note_state: collapsed
    note_display: hover
    note_text: Does not include Bytecode users.
    listen:
      User Role: role.name
    row: 2
    col: 0
    width: 8
    height: 4
  - title: Hours Spent in Looker
    name: Hours Spent in Looker
    model: system__activity
    explore: history
    type: looker_column
    fields: [days_ago, user_hours]
    filters:
      from_bytecode: 'No'
      history.issuer_source: User
    sorts: [days_ago desc]
    limit: 5000
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: diff_days(${history.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - category: dimension
      expression: |-
        case(when(diff_days(${history.created_time}, now()) < 31,"0-30 Days Ago"),
                when(diff_days(${history.created_time}, now())>30 AND diff_days(${history.created_time}, now())<61, "30-60 Days Ago"),
                when(diff_days(${history.created_time}, now())>60, "60-90 Days Ago"),
                "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: contains(${user.email},"bytecode")
      label: From Bytecode?
      value_format:
      value_format_name:
      dimension: from_bytecode
      _kind_hint: dimension
      _type_hint: yesno
    - category: dimension
      expression: concat(${history.user_id}, ${history.created_hour})
      label: user hour pk
      value_format:
      value_format_name:
      dimension: user_hour_pk
      _kind_hint: dimension
      _type_hint: string
    - category: measure
      expression:
      label: User Hours
      value_format:
      value_format_name:
      based_on: user_hour_pk
      _kind_hint: measure
      measure: user_hours
      type: count_distinct
      _type_hint: number
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: true
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: false, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    reference_lines: []
    show_dropoff: true
    defaults_version: 1
    hidden_pivots: {}
    note_state: collapsed
    note_display: hover
    note_text: A count of distinct users and hours from query history. Does not include
      Bytecode users.
    listen:
      User Role: role.name
    row: 2
    col: 8
    width: 8
    height: 4
  - title: Dashboard Views
    name: Dashboard Views
    model: system__activity
    explore: history
    type: looker_column
    fields: [count_of_dashboard_session, days_ago]
    filters:
      from_bytecode: 'No'
      history.issuer_source: User
    sorts: [days_ago desc]
    limit: 5000
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: diff_days(${history.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - category: dimension
      expression: |-
        case(when(diff_days(${history.created_time}, now()) < 31,"0-30 Days Ago"),
                when(diff_days(${history.created_time}, now())>30 AND diff_days(${history.created_time}, now())<61, "30-60 Days Ago"),
                when(diff_days(${history.created_time}, now())>60, "60-90 Days Ago"),
                "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: contains(${user.email},"bytecode")
      label: From Bytecode?
      value_format:
      value_format_name:
      dimension: from_bytecode
      _kind_hint: dimension
      _type_hint: yesno
    - category: dimension
      expression: concat(${history.user_id}, ${history.created_hour})
      label: user hour pk
      value_format:
      value_format_name:
      dimension: user_hour_pk
      _kind_hint: dimension
      _type_hint: string
    - category: measure
      expression:
      label: User Hours
      value_format:
      value_format_name:
      based_on: user_hour_pk
      _kind_hint: measure
      measure: user_hours
      type: count_distinct
      _type_hint: number
    - measure: count_of_dashboard_session
      based_on: history.dashboard_session
      expression: ''
      label: Count of Dashboard Session
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: true
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: false, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    reference_lines: []
    show_dropoff: true
    defaults_version: 1
    hidden_pivots: {}
    note_state: collapsed
    note_display: hover
    note_text: Does not include Bytecode users.
    listen:
      User Role: role.name
    row: 2
    col: 16
    width: 8
    height: 4
  - title: Total Queries by Role
    name: Total Queries by Role
    model: system__activity
    explore: history
    type: looker_area
    fields: [history.created_week, history.count, role.name]
    pivots: [role.name]
    fill_fields: [history.created_week]
    filters:
      from_bytecode: 'No'
      history.issuer_source: User
    sorts: [role.name, history.created_week desc]
    limit: 5000
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: diff_days(${history.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60 AND ${days_in_past}<91, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: contains(${user.email},"bytecode")
      label: From Bytecode?
      value_format:
      value_format_name:
      dimension: from_bytecode
      _kind_hint: dimension
      _type_hint: yesno
    - measure: count_of_connection_id
      based_on: history.connection_id
      expression: ''
      label: Count of Connection ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: normal
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    y_axes: [{label: '', orientation: left, series: [{axisId: Admin - history.count,
            id: Admin - history.count, name: Admin}, {axisId: Carol Test - history.count,
            id: Carol Test - history.count, name: Carol Test}, {axisId: case_study_chrisw
              - history.count, id: case_study_chrisw - history.count, name: case_study_chrisw},
          {axisId: dashboard_editor - history.count, id: dashboard_editor - history.count,
            name: dashboard_editor}, {axisId: dashboard_viewer - history.count, id: dashboard_viewer
              - history.count, name: dashboard_viewer}, {axisId: data viewers demo
              - history.count, id: data viewers demo - history.count, name: data viewers
              demo}, {axisId: delete - history.count, id: delete - history.count,
            name: delete}, {axisId: Developer - history.count, id: Developer - history.count,
            name: Developer}, {axisId: Developer without access to manage_models -
              history.count, id: Developer without access to manage_models - history.count,
            name: Developer without access to manage_models}, {axisId: Embed Creator
              - history.count, id: Embed Creator - history.count, name: Embed Creator},
          {axisId: Embed Viewer - history.count, id: Embed Viewer - history.count,
            name: Embed Viewer}, {axisId: external_snowflake_training_role - history.count,
            id: external_snowflake_training_role - history.count, name: external_snowflake_training_role},
          {axisId: F262bMk6qyCcp66v - history.count, id: F262bMk6qyCcp66v - history.count,
            name: F262bMk6qyCcp66v}, {axisId: FcFqdW6YJvCht5h7 - history.count, id: FcFqdW6YJvCht5h7
              - history.count, name: FcFqdW6YJvCht5h7}, {axisId: GjSfQth6TdKRqbTk
              - history.count, id: GjSfQth6TdKRqbTk - history.count, name: GjSfQth6TdKRqbTk},
          {axisId: hRZkQ3k2Dc2krw9t - history.count, id: hRZkQ3k2Dc2krw9t - history.count,
            name: hRZkQ3k2Dc2krw9t}, {axisId: jetblack_user - history.count, id: jetblack_user
              - history.count, name: jetblack_user}, {axisId: mock_lookml_codev_admin
              - history.count, id: mock_lookml_codev_admin - history.count, name: mock_lookml_codev_admin},
          {axisId: mZ8NbpvjSKswTj2z - history.count, id: mZ8NbpvjSKswTj2z - history.count,
            name: mZ8NbpvjSKswTj2z}, {axisId: Nena's Demo Role - history.count, id: Nena's
              Demo Role - history.count, name: Nena's Demo Role}, {axisId: NkG92P4wnnsGj2VP
              - history.count, id: NkG92P4wnnsGj2VP - history.count, name: NkG92P4wnnsGj2VP},
          {axisId: p9RVrJKx3wh3Nnz8 - history.count, id: p9RVrJKx3wh3Nnz8 - history.count,
            name: p9RVrJKx3wh3Nnz8}, {axisId: Priya_Test - history.count, id: Priya_Test
              - history.count, name: Priya_Test}, {axisId: qfwc3RVxJ4mwNm7C - history.count,
            id: qfwc3RVxJ4mwNm7C - history.count, name: qfwc3RVxJ4mwNm7C}, {axisId: restricted_dev_role
              - history.count, id: restricted_dev_role - history.count, name: restricted_dev_role},
          {axisId: roopa_hr_user - history.count, id: roopa_hr_user - history.count,
            name: roopa_hr_user}, {axisId: roopa_sales_user - history.count, id: roopa_sales_user
              - history.count, name: roopa_sales_user}, {axisId: sCBM6ZWr3FGXnczg
              - history.count, id: sCBM6ZWr3FGXnczg - history.count, name: sCBM6ZWr3FGXnczg},
          {axisId: Test Role - history.count, id: Test Role - history.count, name: Test
              Role}, {axisId: tracy_user_role - history.count, id: tracy_user_role
              - history.count, name: tracy_user_role}, {axisId: tracy_viewer_role
              - history.count, id: tracy_viewer_role - history.count, name: tracy_viewer_role},
          {axisId: User - history.count, id: User - history.count, name: User}, {
            axisId: wvxFJzD4XxdF49pC - history.count, id: wvxFJzD4XxdF49pC - history.count,
            name: wvxFJzD4XxdF49pC}, {axisId: xf5jrZbW7xq3YzhX - history.count, id: xf5jrZbW7xq3YzhX
              - history.count, name: xf5jrZbW7xq3YzhX}, {axisId: YsxZnxcq4r2FHPH4
              - history.count, id: YsxZnxcq4r2FHPH4 - history.count, name: YsxZnxcq4r2FHPH4},
          {axisId: Zendesk EDA Developer Test - history.count, id: Zendesk EDA Developer
              Test - history.count, name: Zendesk EDA Developer Test}, {axisId: ZTest
              - history.count, id: ZTest - history.count, name: ZTest}, {axisId: role.name___null
              - history.count, id: role.name___null - history.count, name: "∅"}],
        showLabels: false, showValues: true, unpinAxis: false, tickDensity: default,
        tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    reference_lines: []
    ordering: none
    show_null_labels: false
    show_dropoff: true
    defaults_version: 1
    hidden_pivots: {}
    hidden_fields: [count_of_dashboard_id]
    note_state: collapsed
    note_display: hover
    note_text: Does not include Bytecode users.
    listen:
      User Role: role.name
    row: 6
    col: 12
    width: 12
    height: 6
  - title: Hours Spent by Role
    name: Hours Spent by Role
    model: system__activity
    explore: history
    type: looker_area
    fields: [user_hours, history.created_week, role.name]
    pivots: [role.name]
    fill_fields: [history.created_week]
    filters:
      from_bytecode: ''
      history.issuer_source: User
    sorts: [role.name, history.created_week desc]
    limit: 5000
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: diff_days(${history.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: contains(${user.email},"bytecode")
      label: From Bytecode?
      value_format:
      value_format_name:
      dimension: from_bytecode
      _kind_hint: dimension
      _type_hint: yesno
    - category: dimension
      expression: concat(${history.user_id}, ${history.created_hour})
      label: user hour pk
      value_format:
      value_format_name:
      dimension: user_hour_pk
      _kind_hint: dimension
      _type_hint: string
    - category: measure
      expression:
      label: User Hours
      value_format:
      value_format_name:
      based_on: user_hour_pk
      _kind_hint: measure
      measure: user_hours
      type: count_distinct
      _type_hint: number
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: normal
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    show_totals_labels: true
    show_silhouette: false
    totals_color: "#808080"
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: false, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    reference_lines: []
    ordering: none
    show_null_labels: false
    show_dropoff: false
    defaults_version: 1
    hidden_pivots: {}
    note_state: collapsed
    note_display: hover
    note_text: A week by week count of the users and hours. Does not include Bytecode
      users.
    listen:
      User Role: role.name
    row: 6
    col: 0
    width: 12
    height: 6
  - name: " (2)"
    type: text
    title_text: ''
    subtitle_text: ''
    body_text: '[{"type":"h1","children":[{"text":"Expanding Analytics Capabilities"}],"align":"center"},{"type":"p","children":[{"text":"These
      metrics measure developer activity"}],"id":"hp1z9","align":"center"}]'
    rich_content_json: '{"format":"slate"}'
    row: 34
    col: 0
    width: 24
    height: 2
  - title: Approximate Dev Hours
    name: Approximate Dev Hours
    model: system__activity
    explore: history
    type: looker_area
    fields: [user_hours, history.created_week, from_bytecode]
    pivots: [from_bytecode]
    fill_fields: [history.created_week]
    filters:
      history.issuer_source: User
      dashboard.link: 'NULL'
      look.id: 'NULL'
      permission_set.permissions: "%develop%"
    sorts: [from_bytecode, history.created_week desc]
    limit: 5000
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: diff_days(${history.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: contains(${user.email},"bytecode")
      label: From Bytecode?
      value_format:
      value_format_name:
      dimension: from_bytecode
      _kind_hint: dimension
      _type_hint: yesno
    - category: dimension
      expression: concat(${history.user_id}, ${history.created_hour})
      label: user hour pk
      value_format:
      value_format_name:
      dimension: user_hour_pk
      _kind_hint: dimension
      _type_hint: string
    - category: measure
      expression:
      label: User Hours
      value_format:
      value_format_name:
      based_on: user_hour_pk
      _kind_hint: measure
      measure: user_hours
      type: count_distinct
      _type_hint: number
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: normal
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    show_totals_labels: true
    show_silhouette: false
    totals_color: "#808080"
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: false, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    series_labels:
      No - user_hours: Internal Developer
      Yes - user_hours: Bytecode Developer
    reference_lines: []
    ordering: none
    show_null_labels: false
    show_dropoff: false
    defaults_version: 1
    hidden_pivots: {}
    note_state: collapsed
    note_display: hover
    note_text: An approximate week by week count of the unique hours spent in development.
      Does not count running an existing dashboard or look. Developers counted here
      are all users with the 'develop' permission.
    listen:
      User Role: role.name
    row: 36
    col: 0
    width: 8
    height: 6
  - title: LookML Changes
    name: LookML Changes
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"save_project_file"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: collapsed
    note_display: hover
    note_text: LookML changes tracks all code changes. This includes integrating new
      data sources, combine data in new ways, or refining labels and definitions.
    listen:
      User Role: role.name
    row: 42
    col: 0
    width: 8
    height: 6
  - title: Looks Created
    name: Looks Created
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"create_look"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: collapsed
    note_display: hover
    note_text: Look creation indicates users are cloning looks for revisions or making
      all-new reports.
    listen:
      User Role: role.name
    row: 28
    col: 0
    width: 8
    height: 6
  - title: Look Modifications
    name: Look Modifications
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"save_look"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: collapsed
    note_display: hover
    note_text: Look Modifications indicate users are refining and improving reports,
      making them better for others.
    listen:
      User Role: role.name
    row: 28
    col: 8
    width: 8
    height: 6
  - title: Dashboards Created
    name: Dashboards Created
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"copy_dashboard","create_dashboard","import_lookml_dashboard"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: collapsed
    note_display: hover
    note_text: Dashboard creation indicates users are cloning dashboards for revisions
      or making all-new reports.
    listen:
      User Role: role.name
    row: 22
    col: 0
    width: 8
    height: 6
  - title: Dashboard Modifications
    name: Dashboard Modifications
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"update_dashboard"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: collapsed
    note_display: hover
    note_text: Dashboard Modifications indicate users are refining and improving reports,
      making them better for others.
    listen:
      User Role: role.name
    row: 22
    col: 8
    width: 8
    height: 6
  - title: Connections Created
    name: Connections Created
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"create_connection"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: collapsed
    note_display: hover
    note_text: Additional connections indicates more data sources are being brought
      into Looker. This indicates Looker's usefulness is broadening.
    listen:
      User Role: role.name
    row: 42
    col: 8
    width: 8
    height: 6
  - title: Dashboards Downloaded
    name: Dashboards Downloaded
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"download_dashboard"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: collapsed
    note_display: hover
    note_text: Dashboard downloads indicate users are either getting a snapshot of
      the data, sharing dashboard data with others, or pulling data into another tool
      for further analysis.
    listen:
      User Role: role.name
    row: 14
    col: 0
    width: 8
    height: 6
  - title: New Schedules
    name: New Schedules
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"new_scheduled_plan"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: collapsed
    note_display: hover
    note_text: Schedule creation indicates that the dashboards are valuable enough
      that some users want them to be regularly delivered.
    listen:
      User Role: role.name
    row: 14
    col: 8
    width: 8
    height: 6
  - title: SQL  Runner Queries
    name: SQL  Runner Queries
    model: system__activity
    explore: event
    type: looker_line
    fields: [count_of_id, event.created_week]
    fill_fields: [event.created_week]
    filters:
      event.name: '"run_sql_query"'
    sorts: [event.created_week desc]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    note_state: expanded
    note_display: above
    note_text: SQL Runner can be used for resolving primary keys and joins during
      development. It can also be used for ad-hoc analysis. Analysis is reusable and
      extensible when the modeling is moved to LookML and the queries are moved to
      an Explore.
    listen:
      User Role: role.name
    row: 50
    col: 12
    width: 12
    height: 6
  - name: " (3)"
    type: text
    title_text: ''
    subtitle_text: ''
    body_text: '[{"type":"h1","children":[{"text":"Deeper Interaction Trends"}],"align":"center"}]'
    rich_content_json: '{"format":"slate"}'
    row: 12
    col: 0
    width: 24
    height: 2
  - title: Total Dashboards
    name: Total Dashboards
    model: system__activity
    explore: dashboard
    type: single_value
    fields: [dashboard.count, dashboard.count_last_30_days]
    filters:
      dashboard.deleted_date: 'NULL'
      dashboard.moved_to_trash: 'No'
    limit: 500
    column_limit: 50
    dynamic_fields:
    - table_calculation: total_dashboards
      label: Total Dashboards
      expression: sum(${dashboard.count})
      value_format:
      value_format_name:
      _kind_hint: measure
      _type_hint: number
      is_disabled: true
    - table_calculation: last_30_days
      label: Last 30 days
      expression: |-
        sum(
          if(diff_days(${dashboard.created_date}, now()) <= 30, ${dashboard.count},0))
      value_format:
      value_format_name:
      _kind_hint: measure
      _type_hint: number
      is_disabled: true
    - measure: in_last_30_days
      based_on: dashboard.id
      type: count_distinct
      label: In Last 30 Days
      value_format:
      value_format_name:
      _kind_hint: measure
      _type_hint: number
      filter_expression: diff_days(${dashboard.created_date}, now()) <= 30
    custom_color_enabled: false
    custom_color: forestgreen
    show_single_value_title: true
    single_value_title: ''
    show_comparison: false
    comparison_type: change
    comparison_reverse_colors: false
    show_comparison_label: true
    comparison_label: Last 30 Days
    hidden_fields:
    note_state: collapsed
    note_display: hover
    note_text: The total dashboards indicates how many reports now exist in Looker.
      Includes both personal and public dashboards.
    y_axes: []
    listen:
      User Role: role.name
    row: 23
    col: 16
    width: 8
    height: 5
  - title: Total Looks
    name: Total Looks
    model: system__activity
    explore: look
    type: single_value
    fields: [look.count, look.count_last_30_days]
    filters:
      look.deleted_date: 'NULL'
    limit: 500
    column_limit: 50
    custom_color_enabled: false
    custom_color: forestgreen
    show_single_value_title: true
    show_comparison: false
    comparison_type: change
    comparison_reverse_colors: false
    show_comparison_label: true
    comparison_label: Last 30 Days
    hidden_fields:
    note_state: collapsed
    note_display: hover
    note_text: The total Looks indicates how many Looks now exist in Looker. Includes
      both personal and public Looks.
    y_axes: []
    listen:
      User Role: role.name
    row: 28
    col: 16
    width: 8
    height: 6
  - title: Total Schedules
    name: Total Schedules
    model: system__activity
    explore: scheduled_plan
    type: single_value
    fields: [scheduled_plan.count, scheduled_plan.count_last_30_days]
    filters:
      scheduled_plan.run_once: 'No'
      scheduled_plan.enabled: 'Yes'
    limit: 500
    column_limit: 50
    custom_color_enabled: false
    custom_color: forestgreen
    show_single_value_title: true
    show_comparison: false
    comparison_type: change
    comparison_reverse_colors: false
    show_comparison_label: true
    comparison_label: Last 30 Days
    hidden_fields:
    note_state: collapsed
    note_display: hover
    note_text: The total schedules is one indication of how much users are relying
      on Looker to deliver regular reports.
    y_axes: []
    listen:
      User Role: role.name
    row: 15
    col: 16
    width: 8
    height: 5
  - title: Top Unlimited Downloads Users
    name: Top Unlimited Downloads Users
    model: system__activity
    explore: history
    type: looker_grid
    fields: [user.name, history.count, history.issuer_source, history.source]
    filters:
      query.limit: "-1"
    sorts: [history.count desc 0]
    limit: 10
    column_limit: 50
    show_view_names: true
    show_row_numbers: false
    transpose: false
    truncate_text: true
    hide_totals: false
    hide_row_totals: false
    size_to_fit: true
    table_theme: white
    limit_displayed_rows: false
    enable_conditional_formatting: false
    header_text_alignment: left
    header_font_size: '12'
    rows_font_size: '12'
    conditional_formatting_include_totals: false
    conditional_formatting_include_nulls: false
    truncate_column_names: false
    hidden_fields: []
    y_axes: []
    note_state: expanded
    note_display: above
    note_text: Check with these users to learn about their use cases for downloading
      all results. With some training or development, perhaps their analysis could
      be done within Looker.
    defaults_version: 1
    listen:
      User Role: role.name
    row: 56
    col: 0
    width: 12
    height: 6
  - name: " (4)"
    type: text
    title_text: ''
    subtitle_text: ''
    body_text: '[{"type":"h1","children":[{"text":"Danger Zone"}],"align":"center"},{"type":"p","children":[{"text":"Increases
      in these metrics may indicate adoption anti-patterns."}],"id":"vxcfs","align":"center"}]'
    rich_content_json: '{"format":"slate"}'
    row: 48
    col: 0
    width: 24
    height: 2
  - title: Unlimited Downloads
    name: Unlimited Downloads
    model: system__activity
    explore: history
    type: looker_line
    fields: [history.created_week, history.count]
    fill_fields: [history.created_week]
    filters:
      query.limit: "-1"
    sorts: [history.created_week desc]
    limit: 100
    column_limit: 50
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: true
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: history.count, id: history.count,
            name: History Count}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    show_row_numbers: false
    transpose: false
    truncate_text: true
    hide_totals: false
    hide_row_totals: false
    size_to_fit: true
    table_theme: white
    enable_conditional_formatting: false
    header_text_alignment: left
    header_font_size: '12'
    rows_font_size: '12'
    conditional_formatting_include_totals: false
    conditional_formatting_include_nulls: false
    truncate_column_names: false
    hidden_fields: []
    note_state: expanded
    note_display: above
    note_text: 'Unlimited downloads are dumps of the data model into other tools.
      They can indicate users doing exploration, analysis and reporting outside of
      Looker. Analysis is more reusable and reliable if it is done within Looker instead. '
    defaults_version: 1
    listen:
      User Role: role.name
    row: 50
    col: 0
    width: 12
    height: 6
  - title: Top SQL Runner Queries by User
    name: Top SQL Runner Queries by User
    model: system__activity
    explore: event
    type: looker_grid
    fields: [event.count, user.name]
    filters:
      event.name: '"run_sql_query"'
    sorts: [event.count desc 0]
    limit: 500
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - category: dimension
      expression: diff_days(${event.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - measure: count_of_id
      based_on: event.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    query_timezone: America/Los_Angeles
    show_view_names: false
    show_row_numbers: false
    transpose: false
    truncate_text: true
    hide_totals: false
    hide_row_totals: false
    size_to_fit: true
    table_theme: white
    limit_displayed_rows: false
    enable_conditional_formatting: false
    header_text_alignment: left
    header_font_size: '12'
    rows_font_size: '12'
    conditional_formatting_include_totals: false
    conditional_formatting_include_nulls: false
    show_sql_query_menu_options: false
    show_totals: true
    show_row_totals: true
    truncate_header: false
    minimum_column_width: 75
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: true
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    defaults_version: 1
    hidden_pivots: {}
    y_axes: []
    note_state: expanded
    note_display: above
    note_text: Check with these users to learn about their use cases for SQL Runner.
      If they are doing ad-hoc analysis and reporting, perhaps their analysis could
      be done within an Explore.
    listen:
      User Role: role.name
    row: 56
    col: 12
    width: 12
    height: 6
  - title: Current Date
    name: Current Date
    model: system__activity
    explore: history
    type: looker_grid
    fields: [history.id]
    filters:
      from_bytecode: 'No'
    limit: 1
    column_limit: 50
    dynamic_fields:
    - category: dimension
      expression: diff_days(${history.created_date},now())
      label: Days in past
      value_format:
      value_format_name:
      dimension: days_in_past
      _kind_hint: dimension
      _type_hint: number
    - category: dimension
      expression: |-
        case(when(${days_in_past} < 31,"0-30 Days Ago"),
          when(${days_in_past}>30 AND ${days_in_past}<61, "30-60 Days Ago"),
          when(${days_in_past}>60, "60-90 Days Ago"),
          "")
      label: Days Ago
      value_format:
      value_format_name:
      dimension: days_ago
      _kind_hint: dimension
      _type_hint: string
    - measure: count_of_id
      based_on: user.id
      expression: ''
      label: Count of ID
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    - category: dimension
      expression: contains(${user.email},"bytecode")
      label: From Bytecode?
      value_format:
      value_format_name:
      dimension: from_bytecode
      _kind_hint: dimension
      _type_hint: yesno
    - category: table_calculation
      expression: now()
      label: current date
      value_format:
      value_format_name:
      _kind_hint: dimension
      table_calculation: current_date
      _type_hint: date
    show_view_names: false
    show_row_numbers: false
    transpose: false
    truncate_text: true
    hide_totals: false
    hide_row_totals: false
    size_to_fit: true
    table_theme: white
    limit_displayed_rows: false
    enable_conditional_formatting: false
    header_text_alignment: center
    header_font_size: '12'
    rows_font_size: '12'
    conditional_formatting_include_totals: false
    conditional_formatting_include_nulls: false
    show_sql_query_menu_options: false
    show_totals: true
    show_row_totals: true
    truncate_header: false
    minimum_column_width: 75
    series_labels:
      current_date: "."
    series_text_format:
      current_date:
        align: center
    header_font_color: "#fff"
    custom_color_enabled: true
    show_single_value_title: true
    show_comparison: false
    comparison_type: value
    comparison_reverse_colors: false
    show_comparison_label: true
    single_value_title: Current Date
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    legend_position: center
    point_style: none
    show_value_labels: true
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_id, id: count_of_id,
            name: Count of ID}], showLabels: false, showValues: false, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    reference_lines: []
    show_dropoff: true
    defaults_version: 1
    hidden_pivots: {}
    hidden_fields: [history.id]
    listen:
      User Role: role.name
    row: 0
    col: 20
    width: 4
    height: 2
  - title: Total Explores
    name: Total Explores
    model: system__activity
    explore: history
    type: single_value
    fields: [count_of_explore]
    filters:
      history.created_date: 30 days
    limit: 15
    column_limit: 50
    dynamic_fields:
    - measure: count_of_explore
      based_on: query.view
      expression: ''
      label: Count of Explore
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    custom_color_enabled: true
    show_single_value_title: true
    show_comparison: false
    comparison_type: value
    comparison_reverse_colors: false
    show_comparison_label: true
    enable_conditional_formatting: false
    conditional_formatting_include_totals: false
    conditional_formatting_include_nulls: false
    show_view_names: false
    show_row_numbers: true
    transpose: false
    truncate_text: true
    hide_totals: false
    hide_row_totals: false
    size_to_fit: true
    table_theme: white
    limit_displayed_rows: false
    header_text_alignment: left
    header_font_size: '12'
    rows_font_size: '12'
    show_totals: true
    show_row_totals: true
    series_labels:
      user.count: User Count
    series_cell_visualizations:
      history.query_run_count:
        is_active: true
      user.count:
        is_active: true
    truncate_column_names: false
    defaults_version: 1
    hidden_pivots: {}
    y_axes: []
    note_state: collapsed
    note_display: hover
    note_text: Indicates how many explores were in use over the last 30 days.
    listen:
      User Role: role.name
    row: 36
    col: 16
    width: 8
    height: 6
  - title: Explores in Use
    name: Explores in Use
    model: system__activity
    explore: history
    type: looker_line
    fields: [count_of_explore, history.created_week]
    fill_fields: [history.created_week]
    sorts: [history.created_week desc]
    limit: 15
    column_limit: 50
    dynamic_fields:
    - measure: count_of_explore
      based_on: query.view
      expression: ''
      label: Count of Explore
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: false
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    y_axes: [{label: '', orientation: left, series: [{axisId: count_of_explore, id: count_of_explore,
            name: Count of Explore}], showLabels: false, showValues: true, unpinAxis: false,
        tickDensity: default, tickDensityCustom: 5, type: linear}]
    x_axis_zoom: true
    y_axis_zoom: true
    series_labels:
      user.count: User Count
    custom_color_enabled: true
    show_single_value_title: true
    show_comparison: false
    comparison_type: value
    comparison_reverse_colors: false
    show_comparison_label: true
    enable_conditional_formatting: false
    conditional_formatting_include_totals: false
    conditional_formatting_include_nulls: false
    show_row_numbers: true
    transpose: false
    truncate_text: true
    hide_totals: false
    hide_row_totals: false
    size_to_fit: true
    table_theme: white
    header_text_alignment: left
    header_font_size: '12'
    rows_font_size: '12'
    show_totals: true
    show_row_totals: true
    series_cell_visualizations:
      history.query_run_count:
        is_active: true
      user.count:
        is_active: true
    truncate_column_names: false
    defaults_version: 1
    hidden_pivots: {}
    note_state: collapsed
    note_display: hover
    note_text: Shows how many different explores were used each week. More explores
      give more options for analysis.
    listen:
      User Role: role.name
    row: 36
    col: 8
    width: 8
    height: 6
  - title: Total Connections
    name: Total Connections
    model: system__activity
    explore: history
    type: single_value
    fields: [count_of_connection_name]
    filters:
      history.created_date: 30 days
    limit: 15
    column_limit: 50
    dynamic_fields:
    - measure: count_of_explore
      based_on: query.view
      expression: ''
      label: Count of Explore
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    - measure: count_of_connection_name
      based_on: history.connection_name
      expression: ''
      label: Count of Connection Name
      type: count_distinct
      _kind_hint: measure
      _type_hint: number
    custom_color_enabled: true
    show_single_value_title: true
    show_comparison: false
    comparison_type: value
    comparison_reverse_colors: false
    show_comparison_label: true
    enable_conditional_formatting: false
    conditional_formatting_include_totals: false
    conditional_formatting_include_nulls: false
    show_view_names: false
    show_row_numbers: true
    transpose: false
    truncate_text: true
    hide_totals: false
    hide_row_totals: false
    size_to_fit: true
    table_theme: white
    limit_displayed_rows: false
    header_text_alignment: left
    header_font_size: '12'
    rows_font_size: '12'
    show_totals: true
    show_row_totals: true
    series_labels:
      user.count: User Count
    series_cell_visualizations:
      history.query_run_count:
        is_active: true
      user.count:
        is_active: true
    truncate_column_names: false
    defaults_version: 1
    hidden_pivots: {}
    y_axes: []
    note_state: collapsed
    note_display: hover
    note_text: Indicates how many connections were in use in the last 30 days.
    listen:
      User Role: role.name
    row: 42
    col: 16
    width: 8
    height: 6
  - type: button
    name: button_14883
    rich_content_json: '{"text":"Open User Activity Dashboard","description":"Investigate
      more about user activity","newTab":true,"alignment":"center","size":"medium","style":"FILLED","color":"#1A73E8","href":"/dashboards/system__activity::user_activity"}'
    row: 14
    col: 16
    width: 8
    height: 1
  - type: button
    name: button_14890
    rich_content_json: '{"text":"Open Content Activity Dashboard","description":"","newTab":true,"alignment":"center","size":"medium","style":"FILLED","color":"#1A73E8","href":"/dashboards/system__activity::content_activity"}'
    row: 22
    col: 16
    width: 8
    height: 1
  filters:
  - name: User Role
    title: User Role
    type: field_filter
    default_value: ''
    allow_multiple_values: true
    required: false
    ui_config:
      type: tag_list
      display: popover
    model: system__activity
    explore: history
    listens_to_filters: []
    field: role.name
