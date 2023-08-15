class CreateSortOrderEnum < ActiveRecord::Migration[7.0]
  def up
    create_enum :sort_order_options, %w[asc desc]
  end

  def down
    execute <<-SQL
        DROP TYPE sort_order_options;
    SQL
  end
end
