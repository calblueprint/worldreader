Rails.application.routes.draw do
  devise_scope :user do
    get "/logout" => "devise/sessions#destroy"
    get "/login" => "devise/sessions#new"
  end

  devise_for :users, :skip => [:sessions], controllers: {registrations: "registrations"}
  as :user do
    post 'users/sign_in' => 'devise/sessions#create', :as => 'user_session'
    delete 'users/sign_out' => 'devise/sessions#destroy', as: 'destroy_user_session'
  end

  resources :users

  # post "/add_to_cart/:book_id" => "carts#add", :as => "add_to_cart"

  resources :books

  resources :carts do
    member do
      post :remove
      post :create_purchase
    end
  end


  namespace :admin do
    resources :dashboard do
      collection do
        get "display_all_partners", :as => "display_all_partners"
        get "display_partners_new_purchases", :as => "display_partners_new_purchases"
        post '/csv', to: 'dashboard#generate_csv'
        get "/failed_report", to: "dashboard#generate_failed_report"
        post '/convert', to: 'dashboard#convert_purchases'
        post '/disapprove', to: 'dashboard#disapprove_purchases'
      end
      member do
        get "get_number_purchases", :as => "get_number_purchases"
        get "partner_information", :as => "partner_information"
        get "display_groups", :as => "display_groups"
        get "display_purchases", :as => "display_purchases"
        get "display_books", :as => "display_books"
        get "display_book", :as => "display_book"
        post "/toggle_flag", :to => "dashboard#toggle_flag"
      end
    end
    resources :recommendations do
      collection do
        get "display_recommendations", :as => "display_recommendations"
        post "/add", :to => "recommendations#add_recommendation"
        post "/delete", :to => "recommendations#delete_recommendation"
      end
      member do
        post "/edit", :to => "recommendations#edit_recommendation"
        get "display_books"
        get "display_book_tags"
        get "display_proj_tags"
      end
    end
  end

  # API routes for react updates
  namespace :api do
    namespace :v1 do
      resources :carts do
        collection do
          post "add/:book_id" => "carts#add"
          post "remove/:book_id" => "carts#remove"
        end
      end
      resources :books do
        collection do
          get "" => "books#index"
          get "search/" => "books#search"
          get "page" => "books#page"
        end
      end
      resources :base_lists do
        member do
          get "books/" => "base_lists#books"
        end
      end
      resources :projects do
        collection do
          get "search/" => "projects#search"
        end
      end
    end
  end

  root to: "books#index"
end
