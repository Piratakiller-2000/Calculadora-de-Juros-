import os
import sys
import webview

def get_resource_path(relative_path):
    """ Retorna o caminho absoluto do recurso, compatível com PyInstaller e dev. """
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

class FinancialAPI:
    def calculate_compound_interest(self, initial_amount, monthly_deposit, interest_rate, period, is_annual_period):
        try:
            initial = float(initial_amount)
            deposit = float(monthly_deposit)
            raw_rate = float(interest_rate) / 100.0
            
            # Se a unidade for em anos, converte o período para meses e a taxa anual para mensal equivalente
            if is_annual_period:
                months = int(period * 12)
                # Converter taxa anual para taxa mensal equivalente
                monthly_rate = ((1 + raw_rate) ** (1 / 12)) - 1
            else:
                months = int(period)
                monthly_rate = raw_rate

            if months <= 0:
                return {"success": False, "error": "O período deve ser maior que zero."}

            accumulated = initial
            total_invested = initial
            total_interest = 0.0

            monthly_schedule = []
            annual_schedule = []
            
            accumulated_annual_interest = 0.0

            for month in range(1, months + 1):
                # 1. Adiciona o aporte mensal ao montante investido
                accumulated += deposit
                total_invested += deposit

                # 2. Calcula os juros do mês sobre o total acumulado
                interest_month = accumulated * monthly_rate
                accumulated += interest_month
                
                total_interest += interest_month
                accumulated_annual_interest += interest_month

                monthly_schedule.append({
                    "period": month,
                    "interest": round(interest_month, 2),
                    "total_invested": round(total_invested, 2),
                    "total_accumulated": round(accumulated, 2)
                })

                if month % 12 == 0 or month == months:
                    year_num = (month + 11) // 12
                    annual_schedule.append({
                        "period": year_num,
                        "interest": round(accumulated_annual_interest, 2),
                        "total_invested": round(total_invested, 2),
                        "total_accumulated": round(accumulated, 2)
                    })
                    accumulated_annual_interest = 0.0

            return {
                "success": True,
                "final_amount": round(accumulated, 2),
                "total_invested": round(total_invested, 2),
                "total_interest": round(total_interest, 2),
                "monthly_schedule": monthly_schedule,
                "annual_schedule": annual_schedule
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

if __name__ == '__main__':
    api = FinancialAPI()
    html_file = get_resource_path(os.path.join("web", "index.html"))
    icon_path = get_resource_path("icon.ico")

    window = webview.create_window(
        title="Calculadora de Juros Compostos",
        url=f"file:///{html_file}",
        js_api=api,
        width=420,
        height=680,
        resizable=False
    )
    
    webview.start(icon=icon_path if os.path.exists(icon_path) else None)