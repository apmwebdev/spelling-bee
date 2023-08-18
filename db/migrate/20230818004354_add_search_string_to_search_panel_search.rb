class AddSearchStringToSearchPanelSearch < ActiveRecord::Migration[7.0]
  def change
    add_column :search_panel_searches, :search_string, :string
  end
end
