class Quote < ApplicationRecord
  def next_id
    # (self.id)+1
    self.class.where('id > ?', self.id).pluck(:id).first
  end

  def previous_id
    # (self.id)-1
    self.class.where('id < ?', self.id).pluck(:id).last
  end
end
