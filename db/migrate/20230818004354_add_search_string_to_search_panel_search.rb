class AddSearchStringToSearchPanelSearch < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:search_panel_searches, :search_string)
      add_column :search_panel_searches, :search_string, :string, null: false
    end
  end
end
