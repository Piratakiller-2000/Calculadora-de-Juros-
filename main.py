import os
import sys
import webview

class Api:
    # Atualizamos a função para receber rate_type, cdi_annual e cdi_percentage
    def calculate_compound_interest(self, initial, monthly, period, is_annual, rate_type, rate, cdi_annual, cdi_percentage):
        try:
            # --- INÍCIO DAS VALIDAÇÕES BÁSICAS ---
            if period < 1:
                return {"success": False, "error": "O período não pode ser menor que 1."}
            
            if initial == 0 and monthly == 0:
                return {"success": False, "error": "Insira um Valor Inicial ou Aporte Mensal."}
            # --- FIM DAS VALIDAÇÕES BÁSICAS ---

            # --- LÓGICA DE TAXA (FIXA OU CDI) ---
            if rate_type == 'cdi':
                if cdi_annual <= 0 or cdi_percentage <= 0:
                    return {"success": False, "error": "Os valores do CDI devem ser maiores que zero."}
                
                # Calcula a taxa anual efetiva (Ex: 10.5% a.a * 110% = 11.55% a.a)
                final_annual_rate = cdi_annual * (cdi_percentage / 100.0)
                
                # Converte a taxa anual efetiva em taxa mensal usando juros compostos
                rate_decimal = ((1 + (final_annual_rate / 100.0)) ** (1.0 / 12.0)) - 1
            else:
                if rate <= 0:
                    return {"success": False, "error": "A taxa de juros deve ser maior que zero."}
                rate_decimal = rate / 100.0
            # --- FIM DA LÓGICA DE TAXA ---

            months = int(period * 12) if is_annual else int(period)
            
            total_invested = initial
            current_amount = initial
            monthly_schedule = []
            annual_schedule = []
            
            for m in range(1, months + 1):
                interest_for_month = current_amount * rate_decimal
                current_amount += interest_for_month + monthly
                total_invested += monthly
                
                monthly_schedule.append({
                    "period": m,
                    "interest": interest_for_month,
                    "total_invested": total_invested,
                    "total_accumulated": current_amount
                })
                
                # Salva o resumo anual a cada 12 meses
                if m % 12 == 0:
                    annual_schedule.append({
                        "period": m // 12,
                        "interest": current_amount - total_invested,
                        "total_invested": total_invested,
                        "total_accumulated": current_amount
                    })

            total_interest = current_amount - total_invested

            return {
                "success": True,
                "total_invested": total_invested,
                "total_interest": total_interest,
                "final_amount": current_amount,
                "monthly_schedule": monthly_schedule,
                "annual_schedule": annual_schedule
            }
        except Exception as e:
            # Caso ocorra um erro de matemática ou de sistema
            return {"success": False, "error": f"Erro interno: {str(e)}"}

def get_resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

if __name__ == '__main__':
    api = Api()
    html_path = get_resource_path(os.path.join("web", "index.html"))
    
    # Cria a janela ligando a classe Api ao JavaScript
    webview.create_window(
        'Calculadora de Juros Compostos', 
        url=f'file://{html_path}', 
        js_api=api, 
        width=420, 
        height=780  # Altura ajustada de 680 para 780
    )
    webview.start()