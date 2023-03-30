# Dependencies
from shiny import App, render, ui
import pandas as pd
import matplotlib.pyplot as plt
import math
import numpy as np
from scipy.interpolate import interp1d
from scipy.integrate import odeint


# Functions
def f( R_0, recov, N,I, VE,NIlimit1,cov,vac_start, time_end,model_type):
        beta=R_0/recov
        S, I, R, total_inf, total_vac=N-I-cov*N,  I, cov*N, I,cov*N
        initial_values= [S, I, R, total_inf, total_vac]
        sigma, ve, p, b,NIlimit, modely=1/recov, VE, cov, 0,0, model_type
        #parameters=[beta, sigma, ve, p, b,vac_start, NIlimit, modely]
        time1=range (1, time_end+1)
        def vm_B2_hit (  state,time,N, beta, sigma, ve, p, b,vac_start, NIlimit, modely):
                #S, I, R Total_inf, Total_va= state
                F_B = beta*(state[1]/N)
                if (modely==1):
                    F_B = beta*(state[1]/N)*((N-state[2])/N)
                
                if (time>=vac_start):
                    rate=p*ve*(1-NIlimit)
                else:
                    rate=0
                
                #dS = b*(1-p*ve)*N - F_B*S - b*S
                dS = - F_B*state[0] - min(state[0],N*rate)
                #dI = F_B*S - sigma*I - b*I
                dI = F_B*state[0] - sigma*state[1]
                #dR = sigma*I -b*R + b*p*ve*N
                dR = sigma*state[1] + min(state[0],N*rate)
                
                dTotal_inf = F_B*state[0]
                dTotal_vac = N*p # not used
                
                return dS,dI,dR,dTotal_inf,dTotal_vac
         #vm_b2 function
        def vm_B2 ( state,time,N, beta, sigma, ve, p, b,vac_start, NIlimit, modely, hit):
                 #S, I, R Total_inf, Total_va= state
                 F_B = beta*(state[1]/N)
                 if (modely==1):
                   F_B = beta*(state[1]/N)*((N-state[2])/N)
                 
                 if (time>=vac_start and time<=hit):
                    ve=ve*(1-NIlimit)
                    cov=p
                 else:
                    ve=0
                    cov=0
                 rate=p*ve
 
                 #dS = b*(1-p*ve)*N - F_B*S - b*S
                 dS = - F_B*state[0] - min(state[0],N*rate)
                 #dI = F_B*S - sigma*I - b*I
                 dI = F_B*state[0] - sigma*state[1]
                 #dR = sigma*I -b*R + b*p*ve*N
                 dR = sigma*state[1] + min(state[0],N*rate)
                 
                 dTotal_inf = F_B*state[0]
                 dTotal_vac = min(state[0],N*cov) 
                 
                 return dS,dI,dR,dTotal_inf,dTotal_vac
             
        if(model_type==1):
                    a='Model B - Law paper'
        else:
                a='Conventional Sir'
        data_table2=[

            ['Population', "{:,}".format(N)],
            ['Start I', str(I)],
            ['Transmission rate', str(round(beta, 1))],
            ['Recovery', str(recov)+' days' ], 
            ['Daily coverage', str(round(cov*100, 1))+' %' ],
            ['Vaccine efficiency' , str(VE*100)+' %' ],
            ['NI limit', str(NIlimit1*100)+' %' ], 
            ['Vaccination Start', str(vac_start)+' days'], 
            ['Model duration', str(time_end)+' days'],
            ['Model type', a]

        ]
        #colors used for the table
        colors2 = [[ "cyan", "cyan"], ["yellow", "yellow"],
        [ "cyan", "cyan"],[ "yellow", "yellow"], [ "cyan", "cyan"], ["yellow", "yellow"],
        [ "cyan", "cyan"],[ "yellow", "yellow"], [ "cyan", "cyan"],[ "yellow", "yellow"]]
             
        vm_model_B_hit=odeint(vm_B2_hit,  initial_values, time1, args=(N, beta, sigma, ve, p, b,vac_start, NIlimit, modely))
        _S, _I, _R, _Total_inf, _Total_va=  vm_model_B_hit.T
        df_B_hit=pd.DataFrame({
         'susceptible': _S,
         'infected': _I,
         'recovered': _R,
         'tot_infected':_Total_inf,
         'tot_vacinated':_Total_va,
         'day': time1  })
        df_B_hit= df_B_hit*100/N
        df_B_hit['day']= df_B_hit['day']*N/100
        interpolate_y=interp1d(  df_B_hit['recovered'],  df_B_hit['day'], fill_value="extrapolate")
        y_hit=100*(1/ve)*(1-1/R_0)
        hday=interpolate_y(y_hit)

         
        if vac_start<hday:
               
                  VM_model_B=odeint(vm_B2, initial_values, time1, args=(N, beta, sigma, ve, p, b,vac_start, NIlimit, modely,hday))
                  #plot output Classical Sir Model
                  S_, I_, R_, Total_inf_, Total_va_= VM_model_B.T
                  df_B=pd.DataFrame({
                  'susceptible': S_,
                  'infected': I_,
                  'recovered': R_,
                  'tot_infected':Total_inf_,
                  'tot_vaccinated':Total_va_,
                  'day': time1  })

                  df_B=100*df_B/N

                  df_B['day']=df_B['day']*N/100

                  
                  #cR0=str(recov*beta)
                  L=dict()
                  if (hday<=10000):
                      L['hi_day']=math.ceil(hday)
                  else:
                      L['hi_day']="-"
                     #accessing
                  a1=list(df_B['tot_infected'])
                  L['tot_inf_n']=(round(a1[len(a1)-1]*N/100))
                  L['tot_inf_p']=str(round(a1[len(a1)-1], 1))
                  a3=list(df_B['tot_vaccinated'])
                  L['tot_treats_n']=(round(a3[len(a3)-1]*N/100))
                  L['tot_treats_p']=str(round(a3[len(a3)-1], 1))
                  
                  #NI limit from user input
                  NIlimit=NIlimit1

                  VM_model_B_NI=odeint(vm_B2_hit,initial_values, time1, args=(N, beta, sigma, ve, p, b,vac_start,   NIlimit, modely))
                  S1, I1, R1, Total_inf1, Total_va1=  VM_model_B_NI.T

                  VM_model_B_NI=pd.DataFrame({
                     'susceptible': S1,
                     'infected': I1,
                     'recovered': R1,
                     'tot_infected':Total_inf1,
                     'tot_vacinated':Total_va1,
                     'day': time1  })
                  VM_model_B_NI=VM_model_B_NI*100/N
                  VM_model_B_NI['day']=VM_model_B_NI['day']*N/100

              
                  interpolate_y=interp1d( VM_model_B_NI['recovered'], VM_model_B_NI['day'], fill_value="extrapolate")
                  y_ni=100*(1/(ve-NIlimit))*(1-1/R_0)
                  hday_ni=interpolate_y(y_ni)


                  VM_model_B_NI=odeint(vm_B2, initial_values, time1, args=(N, beta, sigma, ve, p, b,vac_start, NIlimit, modely,hday_ni))
                  #plot output Classical Sir Model
                  S2, I2, R2, Total_inf2, Total_va2= VM_model_B_NI.T
                  df_B_NI=pd.DataFrame({
                  'susceptible': S2,
                  'infected': I2,
                  'recovered': R2,
                  'tot_infected':Total_inf2,
                  'tot_vaccinated':Total_va2,
                  'day': time1  })

                  df_B_NI=100* df_B_NI/N

                  df_B_NI['day']= df_B_NI['day']*N/100

                  L_ni=dict()
                  if (hday_ni<=10000):
                      L_ni['hi_day']=math.ceil(hday_ni)
                  else:
                      L_ni['hi_day']="-"
                  #accessing
                  b1=list(df_B_NI['tot_infected'])
                  L_ni['tot_inf_n']=(round(b1[len(b1)-1]*N/100))
                  L_ni['tot_inf_p']=str(round(b1[len(b1)-1], 1))
                  b2=list(df_B_NI['tot_vaccinated'])
                  L_ni['tot_treats_n']=(round(b2[len(b2)-1]*N/100))
                  L_ni['tot_treats_p']=str(round(b2[len(b2)-1], 1))

                  #data and colors for the comparision table

                  #colors used for the comparison table
                  colors1= [[ "azure", "azure", 'azure'], ["mintcream", "mintcream",'mintcream'],
                    [ "cyan", "cyan", "cyan"],[ "greenyellow", "greenyellow", "greenyellow"], [ "mintcream", "mintcream",'mintcream'], ["greenyellow", "greenyellow", "greenyellow"]]
                  
                  #data
                  data_table1=[

                        ['      ', "Actual VE", "At NI limit"],
                        ['HI day', str(L['hi_day']) ,str(L_ni['hi_day'])],
                        ['num infected', "{:,}".format(L['tot_inf_n']), "{:,}".format(L_ni['tot_inf_n'])],
                        ['per pop inf', str( L['tot_inf_p']), str( L_ni['tot_inf_p']) ], 
                        ['num treated', "{:,}".format(L['tot_treats_n']), "{:,}".format(L_ni['tot_treats_n'])],
                        ['per pop trt' , str(L['tot_treats_p']), str(L_ni['tot_treats_p']) ],
                         ]

                  return (df_B_NI, df_B, data_table1, data_table2, colors1, colors2, hday_ni, hday, y_ni, y_hit)
            
        else:  
             
              return [vac_start, hday, data_table2, colors2]
              









# UI
app_ui = ui.page_fluid(
        ui.layout_sidebar(
            ui.panel_sidebar(
                ui.input_slider("pop_size", "Population size", min=10000, max=1000000,value=500000,step=1000),
                ui.input_slider("inf_start", "Infectious start size", 1, 100, 30),
                ui.input_slider("r0_val", "R0", min=1.1, max=15, value=5,step=0.1),
                ui.input_slider("recov", "Recovery period (days)", 1, 30, 7),
                ui.input_slider("vacc_cov", "% Vaccine coverage", min=0.001, max=0.01, value=0.005,step=0.0001),
                ui.input_slider("vacc_eff", "Vaccine efficacy", 0.5, 1, 0.9),
                ui.input_slider("non_inf", "Non-inferiorioty limit", 0.1, 0.3, 0.1),
                ui.input_slider("vacc_day", "Vaccine start day", 1, 100, 10),
                ui.input_slider("mod_dur", "Model duration", 200, 365, 300)
            ),
        ui.panel_main(
            ui.input_select("mod_word", "Model type", {"law_meth":"Law" ,"stan_meth": "Standard"}),
            ui.output_plot("plot",height="700px",width="100%"),
            ui.markdown(
        """
        ### Effect of reducing VE by NI limit
        """
    ),
        )
    )
)

# Server
def server(input, output, session):
    @output
    @render.plot(alt="A simulation plot")
    def plot():
        N=input.pop_size()
        I=input.inf_start()
        R_0=input.r0_val()
        VE=input.vacc_eff()
        recov=input.recov()
        cov=input.vacc_cov()
        NIlimit=input.non_inf()
        time_end=input.mod_dur()
        vac_start=input.vacc_day()
        model_type_word=input.mod_word()
        if(model_type_word=="law_meth"):
               model_type=1
        else:
               model_type=2

        if (len(f(R_0, recov, N,I, VE,NIlimit,cov,vac_start, time_end,model_type))==4):
            vac_start, hday, data_table2, colors2=f(R_0, recov, N,I, VE,NIlimit,cov,vac_start, time_end,model_type)
            vac_start1=str(vac_start)
            if (hday<=10000):
                hday1=str(int(np.round(hday)))
            else:
                hday1="-"
            table=[['The vaccination start day of '+vac_start1+ " is on or after the day of herd immunity "+hday1]]
            fig, ax = plt.subplots()#figsize=(10.6,7.5))
            ax.axis('off')
            ax.axis('tight')
            ax.table( 
                cellText=table,
                cellColours=[['yellow']],
                cellLoc ='center',  
                fontsize=16,
                loc ='upper left'
                ) 
            ax.set_title("Message", 
                        fontweight ="bold")
            #ax.annotate(alert_message, xy = (4, 4))
        
            #fig.tight_layout()
            return fig
 
        
        else:
            #displaying the whole model tables and graphs
            df, df1, data_table1, data_table2, colors1, colors2, hday_ni, hday, y_ni, y_hit=f(R_0, recov, N,I, VE,NIlimit,cov,vac_start, time_end,model_type)
        
            #df, df1, data_table1, data_table2, colors1, colors2=f(0.3,10,1000000,1,0.95,0.1,0.003,1,200,1)
            fig, ax = plt.subplots(2, 2)#, figsize=(10.6,10.6))
        
            #df is the model that changes with change in NI limit value
            ax[1,1].set_facecolor('#F8F8F8')
            ax[1, 1].plot(df['day'], df['infected'], lw=2,color="red",label="I")
            ax[1, 1].plot(df['day'], df['susceptible'], lw=2,color="blue",label="S")
            ax[1, 1].plot(df['day'], df['recovered'], lw=2,color="green",label="R")
            ax[1, 1].plot(df['day'], df['tot_infected'], lw=2,color="black",label="Tot I")
            ax[1, 1].axhline(y=y_ni,color='cyan', label="HI")
            ax[1, 1].axvline(x=hday_ni,color='cyan')
            #printing a custom message when there is no herd immunity 
            if(y_ni>100):
                ax[1,1].text(50, 80, " No herd immuinity", ha="center", va="center", fontsize=10, bbox={"facecolor":"cyan", "alpha":0.9} )
                ax[1, 1].set_title('NI limit=' + str(round((NIlimit*100), 2))+'% '   +' R0=' + str(round(R_0,2)), loc='right')
            else:
                ax[1, 1].set_title('NI limit=' + str(round((NIlimit*100), 2))+'% '   +' R0=' + str(round(R_0,2)))
            plt.xlim([0, time_end])
            ax[1,1].set_ylim([0, 100])
            ax[1,1].set_xlabel('Time, Day')
            ax[1,1].set_ylabel('Proportion, %', size='large')
            ax[1, 1].grid()
            ax[1, 1].legend(loc='upper center', bbox_to_anchor=(0.5, -0.15),
                    fancybox=True, shadow=True, ncol=5)
            ax[0, 1].axis('off')
            ax[0, 1].axis('tight')
            ax[0, 1].table( 
                cellText=data_table1,
                cellColours=colors1,
                cellLoc ='center',  
                loc ='upper left')
            ax[0,1].set_title('Comparison', 
                        fontweight ="bold")
            
        
            ax[1, 0].plot(df1['day'], df1['infected'], lw=2,color="red",label="I")
            ax[1, 0].plot(df1['day'], df1['susceptible'], lw=2,color="blue",label="S")
            ax[1, 0].plot(df1['day'], df1['recovered'], lw=2,color="green",label="R")
            ax[1, 0].plot(df1['day'], df1['tot_infected'], lw=2,color="black",label="Tot I")
            ax[1, 0].axhline(y=y_hit,color='cyan', label="HI")
            #printing a custom message when there is no herd immunity 
            if(y_hit>100):
                  ax[1,0].text(50, 80, " No herd immuinity", ha="center", va="center", fontsize=10, bbox={"facecolor":"cyan", "alpha":0.9} )
            ax[1, 0].axvline(x=hday,color='cyan')
            ax[1, 0].set_title('R0=' + str(round(R_0,2)))
            ax[1,0].set_xlim([0, time_end])
            ax[1,0].set_ylim([0, 100])
            ax[1,0].set_xlabel('Time, Day')
            ax[1,0].set_ylabel('Proportion, %', size='large')
            ax[1, 0].grid()
            ax[1,0].legend(loc='upper center', bbox_to_anchor=(0.5, -0.15),
                    fancybox=True, shadow=True, ncol=5)
            ax[0, 0].axis('off')
            ax[0, 0].axis('tight')
            ax[0, 0].table( 
                cellText=data_table2,
                cellColours=colors2,
                cellLoc ='center',  
                loc ='upper left'
                ) 
            ax[0,0].set_title('Input Values', 
                        fontweight ="bold")
            #fig.tight_layout()
            return fig
        
        
        
 


app = App(app_ui, server)